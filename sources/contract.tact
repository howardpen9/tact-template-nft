import "Collection";

message TransferTo {
    ItemId: Int;
    To: Address;
}

contract Sample with Collection {
    collection_owner: Address;
    next_item_index: Int;
    is_initialized: Bool;
    content: Cell?;
    royalty_params: Cell?;

    init(collection_owner: Address, is_initialized: Bool, content: Cell?, royalty_params: Cell?){
        self.collection_owner = collection_owner;
        self.next_item_index = 0; 

        self.is_initialized = is_initialized;   // Collection related setting
        self.content = content;                 // content for the collection
        self.royalty_params = royalty_params;   // Royalty Setting for collection
    }
    receive("Mint"){
        let ctx: Context = context();
        self.mint(ctx.sender);
    }

    receive(msg: TransferTo){
        let ctx: Context = context();
        self.transferTo(ctx.sender, msg.ItemId, msg.To);
    }
    // Update Content
    // Update RoyaltyFee
    // Change Owner of Collection 
}

