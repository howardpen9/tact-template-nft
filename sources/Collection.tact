struct CollectionData {
    next_item_index: Int;
    owner_address: Address;
    collection_content: Cell?;
}
message UpdateCollectionContent {
    content: Cell?;
}
message UpdateRoyaltyParams{
    royalty_params: Cell?;
}

trait Collection {
    next_item_index: Int;       // The latest itemId will be next
    collection_owner: Address;  // The owner address of this collection contract
    is_initialized: Bool;      // Is this collection is serialzied.
    content: Cell?;             // The content information about this collection 
    royalty_params: Cell?;      // The Royalties Fee Setting

    receive(msg: UpdateCollectionContent){ // TODO
        let ctx: Context = context();
        require(ctx.sender == self.collection_owner, "not the owner");
        self.content = msg.content;
    }
    receive(msg: UpdateRoyaltyParams) { // TODO
        let ctx: Context = context();
        require(ctx.sender == self.collection_owner, "not the owner");
        self.royalty_params = msg.royalty_params;
    } 

    // ==== Private Methods === //
    fun mint(sender: Address) {
        // TODO// if (is_initialized == false) { // net_item_index == -1 }
        require(self.next_item_index >= 0, "non-sequential NFTs");
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        let nftItemAddress: Address = contractAddress(nft_init);
        send(SendParameters{
                to: nftItemAddress, 
                value: 0, 
                bounce: false,
                mode: SendRemainingValue,
                body: abi.pack_cell(Transfer{
                                            query_id: 0,
                                            item_index: self.next_item_index,
                                            new_owner: sender,
                                            response_destination: self.collection_owner,
                                            custom_payload: emptyCell(),
                                            forward_amount: 0,
                                            forward_payload: emptySlice()
                                            }),
                code: nft_init.code,
                data: nft_init.data
            });
        self.next_item_index  = self.next_item_index  + 1;
    }

    fun transferTo(ItemOwner: Address, ItemId: Int, To: Address) {
        let nft_init: StateInit = self.getNftItemInit(ItemId);
        let nftItemAddress: Address = contractAddress(nft_init);
        send(SendParameters{
            to: nftItemAddress, 
            value: 0, 
            bounce: false,
            mode: SendRemainingValue,
            body: abi.pack_cell(Transfer{
                                        query_id: 0,
                                        item_index: ItemId,
                                        new_owner: To,
                                        response_destination: ItemOwner,
                                        custom_payload: emptyCell(),
                                        forward_amount: 10, // TODO
                                        forward_payload: emptySlice()
                                        }),
            code: nft_init.code,
            data: nft_init.data
        });
    }
    // --------- Get Function  --------- //
    get fun get_collection_data(): CollectionData{     
        return CollectionData{
            next_item_index: self.next_item_index,      
            collection_content: self.content,       
            owner_address: self.collection_owner
        };
    }
    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }
    virtual fun getNftItemInit(index_id: Int): StateInit {
        return initOf NftItem(myAddress(), self.collection_owner, index_id, self.is_initialized);
    }
    get fun get_nft_content(item_index: Int, individual_content: Cell): Cell? {    
        return self.content;
    }
    get fun getCollectionAddress(): Address{
        return myAddress();
    }
}

contract NftItem {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    collection: Address;
    master: Address;
    item_index: Int; 
    is_initialized: Bool;
    sub_content: Cell?;

    init(collection: Address, master: Address, item_index: Int, is_initialized: Bool){
        self.collection = collection;
        self.master = master;
        self.item_index = item_index;
        self.is_initialized = is_initialized;
    }
    receive(msg: Transfer){
        let ctx: Context = context(); // Check sender
        require(ctx.sender == self.collection, "Not The Collection Contract");

        let init: StateInit = initOf NftItem(self.collection, self.master,  msg.item_index, self.is_initialized);
        let itemAddress: Address = contractAddress(init);

        let fwdFee: Int = ctx.readForwardFee(); // Get the forward_fee 
        
        // require(ctx.value - fwdFee - self.gasConsumption - self.minTonsForStorage > 0 , "Gas Value not enough. 1234");
        require(ctx.value > fwdFee + self.gasConsumption + self.minTonsForStorage, "Invalid value");

        if (msg.forward_amount == 0) { 
            require(self.item_index == msg.item_index, "Need to point out the right ItemId");
            send(SendParameters{
                to: itemAddress,
                value: 0,
                mode: SendRemainingValue, 
                bounce: true,
                body: abi.pack_cell(OwnershipAssigned{
                    query_id: msg.query_id,
                    prev_owner:  self.master,
                    forward_payload: msg.forward_payload
                }),
                code: init.code,
                data: init.data
            });        
            self.master = msg.new_owner;    // change current owner to the new_owner
        } else if (msg.forward_amount > 0) { //  msg: forward_amount => the amount of nano-tons to be sent to the new owner.
            require(ctx.sender == self.collection, "Not The Collection Contract");
            require(msg.response_destination == self.master, "Not the Item Owner");
            require(self.item_index == msg.item_index, "Need to point out the right ItemId");
            send(SendParameters{
                to: itemAddress,
                value: 0,
                mode: SendRemainingValue, 
                bounce: true,
                body: abi.pack_cell(OwnershipAssigned{
                    query_id: msg.query_id,
                    prev_owner:  self.master,
                    forward_payload: msg.forward_payload
                }),
                code: init.code,
                data: init.data
            }); 
            self.master = msg.new_owner;
        }
    }

    receive(msg: OwnershipAssigned){ 
        let ctx: Context = context();
        if (ctx.sender != myAddress()) {
            let item_init: StateInit = initOf NftItem(self.collection, self.master, self.item_index,self.is_initialized);
            require(contractAddress(item_init) == ctx.sender, "Invalid sender, only Collection Address can call");
        } 

        // Adjust value for gas 
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);

        // Cashback
        if (msg.forward_payload != null && msgValue > 0) {       
            send(SendParameters{
                to: self.master,
                value: msgValue,
                bounce: false,
                body: abi.pack_cell(NFTExcesses{
                    query_id: msg.query_id
                })
            });
        }   
    }

    receive(msg: GetStaticData){ 
        let nft_init: StateInit = initOf NftItem(self.collection, self.master, self.item_index, self.is_initialized);
        let itemAddress: Address = contractAddress(nft_init);
        send(SendParameters{
            to: itemAddress,
            value: 0,
            mode: 64,  // (return msg amount except gas fees) 
            bounce: true,
            body: abi.pack_cell(ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_index,
                collection: self.master
            }),
            code: nft_init.code,
            data: nft_init.data
        });
    }
    receive(msg: UpdateSubContent){ 
        self.sub_content = msg.content;
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData{ 
        return GetNftData {
            is_initialized: self.is_initialized, 
            index: self.item_index, 
            collection_address: self.collection, 
            owner: self.master,
            individual_content: self.sub_content
        };
    }
    get fun get_nft_owner(): Address {
        return self.master;
    }
}

// [Collection Contract] -> Transfer -> OwnershipAssigned -> NFTExcesses
message(0x5fcc3d14) Transfer { 
    query_id: Int as uint64;                // - arbitrary request number.
    item_index: Int;                        // add new
    new_owner: Address;                     //  - address of the new owner of the NFT item.
    response_destination: Address?;         //  - address where to send a response with confirmation of a successful transfer and the rest of the incoming message coins.
    custom_payload: Cell?;                  // - optional custom data.
    forward_amount: Int as coins;           //  the amount of nanotons to be sent to the new owner.
    forward_payload: Slice? as remaining;   //  optional custom data that should be sent to the new owner.
}
message(0x05138d91) OwnershipAssigned{
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining;
}
message(0xd53276db) NFTExcesses {
    query_id: Int as uint64;
}
message(0x2fcb26a2) GetStaticData { 
    query_id: Int as uint64;
}
message(0x8b771735) ReportStaticData{
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}
// ====== non TEP-62 message ====== // 
message(0xcef1cdcf) UpdateSubContent { 
    content: Cell;
}
struct GetNftData { 
    is_initialized: Int;
    index: Int;
    collection_address: Address; 
    owner: Address;
    individual_content: Cell?;
}


