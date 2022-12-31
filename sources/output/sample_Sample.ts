import { Cell, Slice, StackItem, Address, Builder, InternalMessage, CommonMessageInfo, CellMessage, beginCell, serializeDict, TupleSlice4, readString, stringToCell } from 'ton';
import { ContractExecutor, createExecutorFromCode, ExecuteError } from 'ton-nodejs';
import BN from 'bn.js';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function packStateInit(src: StateInit): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeRef(src.code);
    b_0 = b_0.storeRef(src.data);
    return b_0.endCell();
}

export function packStackStateInit(src: StateInit, __stack: StackItem[]) {
    __stack.push({ type: 'cell', cell: src.code });
    __stack.push({ type: 'cell', cell: src.data });
}

export function packTupleStateInit(src: StateInit): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: src.code });
    __stack.push({ type: 'cell', cell: src.data });
    return __stack;
}

export function unpackStackStateInit(slice: TupleSlice4): StateInit {
    const code = slice.readCell();
    const data = slice.readCell();
    return { $$type: 'StateInit', code: code, data: data };
}
export function unpackTupleStateInit(slice: TupleSlice4): StateInit {
    const code = slice.readCell();
    const data = slice.readCell();
    return { $$type: 'StateInit', code: code, data: data };
}
export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: BN;
    raw: Cell;
}

export function packContext(src: Context): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounced);
    b_0 = b_0.storeAddress(src.sender);
    b_0 = b_0.storeInt(src.value, 257);
    b_0 = b_0.storeRef(src.raw);
    return b_0.endCell();
}

export function packStackContext(src: Context, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.bounced ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.sender).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'slice', cell: src.raw });
}

export function packTupleContext(src: Context): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.bounced ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.sender).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'slice', cell: src.raw });
    return __stack;
}

export function unpackStackContext(slice: TupleSlice4): Context {
    const bounced = slice.readBoolean();
    const sender = slice.readAddress();
    const value = slice.readBigNumber();
    const raw = slice.readCell();
    return { $$type: 'Context', bounced: bounced, sender: sender, value: value, raw: raw };
}
export function unpackTupleContext(slice: TupleSlice4): Context {
    const bounced = slice.readBoolean();
    const sender = slice.readAddress();
    const value = slice.readBigNumber();
    const raw = slice.readCell();
    return { $$type: 'Context', bounced: bounced, sender: sender, value: value, raw: raw };
}
export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: BN;
    mode: BN;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function packSendParameters(src: SendParameters): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounce);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeInt(src.value, 257);
    b_0 = b_0.storeInt(src.mode, 257);
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.code !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.code);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.data !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.data);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackSendParameters(src: SendParameters, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.bounce ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.code !== null) {
        __stack.push({ type: 'cell', cell: src.code });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.data !== null) {
        __stack.push({ type: 'cell', cell: src.data });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleSendParameters(src: SendParameters): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.bounce ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.code !== null) {
        __stack.push({ type: 'cell', cell: src.code });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.data !== null) {
        __stack.push({ type: 'cell', cell: src.data });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackSendParameters(slice: TupleSlice4): SendParameters {
    const bounce = slice.readBoolean();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    const code = slice.readCellOpt();
    const data = slice.readCellOpt();
    return { $$type: 'SendParameters', bounce: bounce, to: to, value: value, mode: mode, body: body, code: code, data: data };
}
export function unpackTupleSendParameters(slice: TupleSlice4): SendParameters {
    const bounce = slice.readBoolean();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    const code = slice.readCellOpt();
    const data = slice.readCellOpt();
    return { $$type: 'SendParameters', bounce: bounce, to: to, value: value, mode: mode, body: body, code: code, data: data };
}
export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: BN;
    owner_address: Address;
    collection_content: Cell | null;
}

export function packCollectionData(src: CollectionData): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeInt(src.next_item_index, 257);
    b_0 = b_0.storeAddress(src.owner_address);
    if (src.collection_content !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.collection_content);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackCollectionData(src: CollectionData, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.next_item_index });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.owner_address).endCell() });
    if (src.collection_content !== null) {
        __stack.push({ type: 'cell', cell: src.collection_content });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleCollectionData(src: CollectionData): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.next_item_index });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.owner_address).endCell() });
    if (src.collection_content !== null) {
        __stack.push({ type: 'cell', cell: src.collection_content });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackCollectionData(slice: TupleSlice4): CollectionData {
    const next_item_index = slice.readBigNumber();
    const owner_address = slice.readAddress();
    const collection_content = slice.readCellOpt();
    return { $$type: 'CollectionData', next_item_index: next_item_index, owner_address: owner_address, collection_content: collection_content };
}
export function unpackTupleCollectionData(slice: TupleSlice4): CollectionData {
    const next_item_index = slice.readBigNumber();
    const owner_address = slice.readAddress();
    const collection_content = slice.readCellOpt();
    return { $$type: 'CollectionData', next_item_index: next_item_index, owner_address: owner_address, collection_content: collection_content };
}
export type UpdateCollectionContent = {
    $$type: 'UpdateCollectionContent';
    content: Cell | null;
}

export function packUpdateCollectionContent(src: UpdateCollectionContent): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(1914141847, 32);
    if (src.content !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.content);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackUpdateCollectionContent(src: UpdateCollectionContent, __stack: StackItem[]) {
    if (src.content !== null) {
        __stack.push({ type: 'cell', cell: src.content });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleUpdateCollectionContent(src: UpdateCollectionContent): StackItem[] {
    let __stack: StackItem[] = [];
    if (src.content !== null) {
        __stack.push({ type: 'cell', cell: src.content });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackUpdateCollectionContent(slice: TupleSlice4): UpdateCollectionContent {
    const content = slice.readCellOpt();
    return { $$type: 'UpdateCollectionContent', content: content };
}
export function unpackTupleUpdateCollectionContent(slice: TupleSlice4): UpdateCollectionContent {
    const content = slice.readCellOpt();
    return { $$type: 'UpdateCollectionContent', content: content };
}
export type UpdateRoyaltyParams = {
    $$type: 'UpdateRoyaltyParams';
    royalty_params: Cell | null;
}

export function packUpdateRoyaltyParams(src: UpdateRoyaltyParams): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(981308892, 32);
    if (src.royalty_params !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.royalty_params);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackUpdateRoyaltyParams(src: UpdateRoyaltyParams, __stack: StackItem[]) {
    if (src.royalty_params !== null) {
        __stack.push({ type: 'cell', cell: src.royalty_params });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleUpdateRoyaltyParams(src: UpdateRoyaltyParams): StackItem[] {
    let __stack: StackItem[] = [];
    if (src.royalty_params !== null) {
        __stack.push({ type: 'cell', cell: src.royalty_params });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackUpdateRoyaltyParams(slice: TupleSlice4): UpdateRoyaltyParams {
    const royalty_params = slice.readCellOpt();
    return { $$type: 'UpdateRoyaltyParams', royalty_params: royalty_params };
}
export function unpackTupleUpdateRoyaltyParams(slice: TupleSlice4): UpdateRoyaltyParams {
    const royalty_params = slice.readCellOpt();
    return { $$type: 'UpdateRoyaltyParams', royalty_params: royalty_params };
}
export type Transfer = {
    $$type: 'Transfer';
    query_id: BN;
    item_index: BN;
    new_owner: Address;
    response_destination: Address | null;
    custom_payload: Cell | null;
    forward_amount: BN;
    forward_payload: Cell | null;
}

export function packTransfer(src: Transfer): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(1607220500, 32);
    b_0 = b_0.storeUint(src.query_id, 64);
    b_0 = b_0.storeInt(src.item_index, 257);
    b_0 = b_0.storeAddress(src.new_owner);
    b_0 = b_0.storeAddress(src.response_destination);
    if (src.custom_payload !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.custom_payload);
    } else {
        b_0 = b_0.storeBit(false);
    }
    b_0 = b_0.storeCoins(src.forward_amount);
    if (src.forward_payload !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeCellCopy(src.forward_payload);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackTransfer(src: Transfer, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.query_id });
    __stack.push({ type: 'int', value: src.item_index });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.new_owner).endCell() });
    if (src.response_destination !== null) {
        __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.response_destination).endCell() });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.custom_payload !== null) {
        __stack.push({ type: 'cell', cell: src.custom_payload });
    } else {
        __stack.push({ type: 'null' });
    }
    __stack.push({ type: 'int', value: src.forward_amount });
    if (src.forward_payload !== null) {
        __stack.push({ type: 'slice', cell: src.forward_payload });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleTransfer(src: Transfer): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.query_id });
    __stack.push({ type: 'int', value: src.item_index });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.new_owner).endCell() });
    if (src.response_destination !== null) {
        __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.response_destination).endCell() });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.custom_payload !== null) {
        __stack.push({ type: 'cell', cell: src.custom_payload });
    } else {
        __stack.push({ type: 'null' });
    }
    __stack.push({ type: 'int', value: src.forward_amount });
    if (src.forward_payload !== null) {
        __stack.push({ type: 'slice', cell: src.forward_payload });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackTransfer(slice: TupleSlice4): Transfer {
    const query_id = slice.readBigNumber();
    const item_index = slice.readBigNumber();
    const new_owner = slice.readAddress();
    const response_destination = slice.readAddressOpt();
    const custom_payload = slice.readCellOpt();
    const forward_amount = slice.readBigNumber();
    const forward_payload = slice.readCellOpt();
    return { $$type: 'Transfer', query_id: query_id, item_index: item_index, new_owner: new_owner, response_destination: response_destination, custom_payload: custom_payload, forward_amount: forward_amount, forward_payload: forward_payload };
}
export function unpackTupleTransfer(slice: TupleSlice4): Transfer {
    const query_id = slice.readBigNumber();
    const item_index = slice.readBigNumber();
    const new_owner = slice.readAddress();
    const response_destination = slice.readAddressOpt();
    const custom_payload = slice.readCellOpt();
    const forward_amount = slice.readBigNumber();
    const forward_payload = slice.readCellOpt();
    return { $$type: 'Transfer', query_id: query_id, item_index: item_index, new_owner: new_owner, response_destination: response_destination, custom_payload: custom_payload, forward_amount: forward_amount, forward_payload: forward_payload };
}
export type OwnershipAssigned = {
    $$type: 'OwnershipAssigned';
    query_id: BN;
    prev_owner: Address;
    forward_payload: Cell;
}

export function packOwnershipAssigned(src: OwnershipAssigned): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(85167505, 32);
    b_0 = b_0.storeUint(src.query_id, 64);
    b_0 = b_0.storeAddress(src.prev_owner);
    b_0 = b_0.storeCellCopy(src.forward_payload);
    return b_0.endCell();
}

export function packStackOwnershipAssigned(src: OwnershipAssigned, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.query_id });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.prev_owner).endCell() });
    __stack.push({ type: 'slice', cell: src.forward_payload });
}

export function packTupleOwnershipAssigned(src: OwnershipAssigned): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.query_id });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.prev_owner).endCell() });
    __stack.push({ type: 'slice', cell: src.forward_payload });
    return __stack;
}

export function unpackStackOwnershipAssigned(slice: TupleSlice4): OwnershipAssigned {
    const query_id = slice.readBigNumber();
    const prev_owner = slice.readAddress();
    const forward_payload = slice.readCell();
    return { $$type: 'OwnershipAssigned', query_id: query_id, prev_owner: prev_owner, forward_payload: forward_payload };
}
export function unpackTupleOwnershipAssigned(slice: TupleSlice4): OwnershipAssigned {
    const query_id = slice.readBigNumber();
    const prev_owner = slice.readAddress();
    const forward_payload = slice.readCell();
    return { $$type: 'OwnershipAssigned', query_id: query_id, prev_owner: prev_owner, forward_payload: forward_payload };
}
export type NFTExcesses = {
    $$type: 'NFTExcesses';
    query_id: BN;
}

export function packNFTExcesses(src: NFTExcesses): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(3576854235, 32);
    b_0 = b_0.storeUint(src.query_id, 64);
    return b_0.endCell();
}

export function packStackNFTExcesses(src: NFTExcesses, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.query_id });
}

export function packTupleNFTExcesses(src: NFTExcesses): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.query_id });
    return __stack;
}

export function unpackStackNFTExcesses(slice: TupleSlice4): NFTExcesses {
    const query_id = slice.readBigNumber();
    return { $$type: 'NFTExcesses', query_id: query_id };
}
export function unpackTupleNFTExcesses(slice: TupleSlice4): NFTExcesses {
    const query_id = slice.readBigNumber();
    return { $$type: 'NFTExcesses', query_id: query_id };
}
export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: BN;
}

export function packGetStaticData(src: GetStaticData): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(801842850, 32);
    b_0 = b_0.storeUint(src.query_id, 64);
    return b_0.endCell();
}

export function packStackGetStaticData(src: GetStaticData, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.query_id });
}

export function packTupleGetStaticData(src: GetStaticData): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.query_id });
    return __stack;
}

export function unpackStackGetStaticData(slice: TupleSlice4): GetStaticData {
    const query_id = slice.readBigNumber();
    return { $$type: 'GetStaticData', query_id: query_id };
}
export function unpackTupleGetStaticData(slice: TupleSlice4): GetStaticData {
    const query_id = slice.readBigNumber();
    return { $$type: 'GetStaticData', query_id: query_id };
}
export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: BN;
    index_id: BN;
    collection: Address;
}

export function packReportStaticData(src: ReportStaticData): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(2339837749, 32);
    b_0 = b_0.storeUint(src.query_id, 64);
    b_0 = b_0.storeInt(src.index_id, 257);
    b_0 = b_0.storeAddress(src.collection);
    return b_0.endCell();
}

export function packStackReportStaticData(src: ReportStaticData, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.query_id });
    __stack.push({ type: 'int', value: src.index_id });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.collection).endCell() });
}

export function packTupleReportStaticData(src: ReportStaticData): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.query_id });
    __stack.push({ type: 'int', value: src.index_id });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.collection).endCell() });
    return __stack;
}

export function unpackStackReportStaticData(slice: TupleSlice4): ReportStaticData {
    const query_id = slice.readBigNumber();
    const index_id = slice.readBigNumber();
    const collection = slice.readAddress();
    return { $$type: 'ReportStaticData', query_id: query_id, index_id: index_id, collection: collection };
}
export function unpackTupleReportStaticData(slice: TupleSlice4): ReportStaticData {
    const query_id = slice.readBigNumber();
    const index_id = slice.readBigNumber();
    const collection = slice.readAddress();
    return { $$type: 'ReportStaticData', query_id: query_id, index_id: index_id, collection: collection };
}
export type UpdateSubContent = {
    $$type: 'UpdateSubContent';
    content: Cell;
}

export function packUpdateSubContent(src: UpdateSubContent): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(3471953359, 32);
    b_0 = b_0.storeRef(src.content);
    return b_0.endCell();
}

export function packStackUpdateSubContent(src: UpdateSubContent, __stack: StackItem[]) {
    __stack.push({ type: 'cell', cell: src.content });
}

export function packTupleUpdateSubContent(src: UpdateSubContent): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: src.content });
    return __stack;
}

export function unpackStackUpdateSubContent(slice: TupleSlice4): UpdateSubContent {
    const content = slice.readCell();
    return { $$type: 'UpdateSubContent', content: content };
}
export function unpackTupleUpdateSubContent(slice: TupleSlice4): UpdateSubContent {
    const content = slice.readCell();
    return { $$type: 'UpdateSubContent', content: content };
}
export type GetNftData = {
    $$type: 'GetNftData';
    is_initialized: BN;
    index: BN;
    collection_address: Address;
    owner: Address;
    individual_content: Cell | null;
}

export function packGetNftData(src: GetNftData): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeInt(src.is_initialized, 257);
    b_0 = b_0.storeInt(src.index, 257);
    b_0 = b_0.storeAddress(src.collection_address);
    let b_1 = new Builder();
    b_1 = b_1.storeAddress(src.owner);
    if (src.individual_content !== null) {
        b_1 = b_1.storeBit(true);
        b_1 = b_1.storeRef(src.individual_content);
    } else {
        b_1 = b_1.storeBit(false);
    }
    b_0 = b_0.storeRef(b_1.endCell());
    return b_0.endCell();
}

export function packStackGetNftData(src: GetNftData, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.is_initialized });
    __stack.push({ type: 'int', value: src.index });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.collection_address).endCell() });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.owner).endCell() });
    if (src.individual_content !== null) {
        __stack.push({ type: 'cell', cell: src.individual_content });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleGetNftData(src: GetNftData): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.is_initialized });
    __stack.push({ type: 'int', value: src.index });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.collection_address).endCell() });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.owner).endCell() });
    if (src.individual_content !== null) {
        __stack.push({ type: 'cell', cell: src.individual_content });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackGetNftData(slice: TupleSlice4): GetNftData {
    const is_initialized = slice.readBigNumber();
    const index = slice.readBigNumber();
    const collection_address = slice.readAddress();
    const owner = slice.readAddress();
    const individual_content = slice.readCellOpt();
    return { $$type: 'GetNftData', is_initialized: is_initialized, index: index, collection_address: collection_address, owner: owner, individual_content: individual_content };
}
export function unpackTupleGetNftData(slice: TupleSlice4): GetNftData {
    const is_initialized = slice.readBigNumber();
    const index = slice.readBigNumber();
    const collection_address = slice.readAddress();
    const owner = slice.readAddress();
    const individual_content = slice.readCellOpt();
    return { $$type: 'GetNftData', is_initialized: is_initialized, index: index, collection_address: collection_address, owner: owner, individual_content: individual_content };
}
export type TransferTo = {
    $$type: 'TransferTo';
    ItemId: BN;
    To: Address;
}

export function packTransferTo(src: TransferTo): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(2306576542, 32);
    b_0 = b_0.storeInt(src.ItemId, 257);
    b_0 = b_0.storeAddress(src.To);
    return b_0.endCell();
}

export function packStackTransferTo(src: TransferTo, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.ItemId });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.To).endCell() });
}

export function packTupleTransferTo(src: TransferTo): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.ItemId });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.To).endCell() });
    return __stack;
}

export function unpackStackTransferTo(slice: TupleSlice4): TransferTo {
    const ItemId = slice.readBigNumber();
    const To = slice.readAddress();
    return { $$type: 'TransferTo', ItemId: ItemId, To: To };
}
export function unpackTupleTransferTo(slice: TupleSlice4): TransferTo {
    const ItemId = slice.readBigNumber();
    const To = slice.readAddress();
    return { $$type: 'TransferTo', ItemId: ItemId, To: To };
}
export async function Sample_init(collection_owner: Address, is_initialized: boolean, content: Cell | null, royalty_params: Cell | null) {
    const __code = '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';
    const depends = new Map<string, Cell>();
    depends.set('31210', Cell.fromBoc(Buffer.from('te6ccgECLQEABcQAART/APSkE/S88sgLAQIBYgIDAgLKBAUCASAnKAIBIAYHAgFiGhsCASAICQIBWBESAgFICgsAR95DgA5YC5gOWAuADlgAlmZmT8gGQ5AOWAuADlgAllA+X/5OhASdRwIddJwh+VMCDXCx/eAtDTAwFxsMABkX+RcOIB+kAiUGZvBPhhApFb4CCCEF/MPRS64wIgghAFE42RuuMCIIIQL8smorrjAoIQzvHNz7qAwNDg8AC0IG7y0ICAHmMO1E0NQB+GL6QAEB+kABAYEBAdcA0gBtAdIAAZIx1N5VQGwVBdMfAYIQX8w9FLry4IHTP4EBAdcA+kABAfpAIdcLAcMAkQGSMW3ibQLSAAGUbBLUEt76AG0B0gABkjEg3gcGBURENxCrEJoQiRB4VQXwIxAA2jDtRNDUAfhi+kABAfpAAQGBAQHXANIAbQHSAAGSMdTeVUBsFQXTHwGCEAUTjZG68uCB0z/6QAFUEgIzEGcQVhBFEDRY8CTI+EIBzFVAUFTPFljPFoEBAc8AEsoAIW6UcDLKAJV/AcoAzOLJ7VQAyjDtRNDUAfhi+kABAfpAAQGBAQHXANIAbQHSAAGSMdTeVUBsFQXTHwGCEC/LJqK68uCB0z8BMRBFEDRBMPAlyPhCAcxVQFBUzxZYzxaBAQHPABLKACFulHAyygCVfwHKAMziye1UANSOY+1E0NQB+GL6QAEB+kABAYEBAdcA0gBtAdIAAZIx1N5VQGwVBdMfAYIQzvHNz7ry4IHUATEQRRA0QTDwJsj4QgHMVUBQVM8WWM8WgQEBzwASygAhbpRwMsoAlX8BygDM4sntVOAw8sCCAE7I+EIBzFVAUFTPFljPFoEBAc8AEsoAIW6UcDLKAJV/AcoAzOLJ7VQAFfSj+A5QBwOADlAEAgEgExQCASAVFgIBIBgZAAkcFnwCIAH3MhxAcoBUAfwG3ABygJQBc8WUAP6AnABymgjbrMlbrOxjj1/8BvIcPAbcPAbJG6zmX/wGwTwAlAEzJU0A3DwG+IkbrOZf/AbBPACUATMlTQDcPAb4nDwGwJ/8BsCyVjMljMzAXDwG+IhbrOYf/AbAfACAcyUMXDwG+LJAYBcABPsAACUbDH6ADFx1yH6ADH6ADCnA6sAgAEcbQXIzAVQVM8WWM8WgQEBzwASygAhbpRwMsoAlX8BygDM4smACASAcHQIBICMkAgEgHh8CASAgIQBrATQ9AQwIIF56gGAEPQPb6Hy4GRtAoF56gGAEPQPb6Hy4GQSgXnqAQKAEPQXyPQAyVUwBfAfgAAcREATgAAkEDRfBIAHdDL4QW8kgSrrUz/HBfL0+EJUf+kv8CBc8BxUJlBSVfAegT67AYIImJaAoIIImJaAoBS8E/L0JMAAjjIyMzQpgSRKB7oW8vR/cFB7gEAEyFUgghAFE42RUATLHxLLPwHPFgHPFskQNRBKQBPwHeMOgIgCWBMIAjkKBKutRLscFEvL0gTNsUVzHBRXy9CmBJEoHuhby9H9wUHuAQATIVSCCEAUTjZFQBMsfEss/Ac8WAc8WyRUQSkAz8B2SXwniAgEgJSYAA0MYAMcMfhBbyQwMvgoUhDHBbOOFPhCVHmHKfAgAYFf3QLwHFjHBfL0kTDi+CdvECGhggiYloBmtgihggiYloCgoQFusyHCALCOGnBwA8gBghDVMnbbWMsfyz/JVBMHVSBtbfAdkVvigAGU+EJUdlQm8CBc8Bx/cIBAVDaayFUgghCLdxc1UATLHxLLP4EBAc8AAc8WyV4yQDME8B2ACASApKgIBSCssAAm6SJ8B+ABPupFe1E0NQB+GL6QAEB+kABAYEBAdcA0gBtAdIAAZIx1N5VQGwV8CKABPtfn9qJoagD8MX0gAID9IACAwICA64BpADaA6QAAyRjqbyqgNgr4EMABNt3owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcw', 'base64'))[0]);
    let systemCell = beginCell().storeDict(serializeDict(depends, 16, (src, v) => v.refs.push(src))).endCell();
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: systemCell });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(collection_owner).endCell() });
    __stack.push({ type: 'int', value: is_initialized ? new BN(-1) : new BN(0) });
    if (content !== null) {
        __stack.push({ type: 'cell', cell: content });
    } else {
        __stack.push({ type: 'null' });
    }
    if (royalty_params !== null) {
        __stack.push({ type: 'cell', cell: royalty_params });
    } else {
        __stack.push({ type: 'null' });
    }
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let executor = await createExecutorFromCode({ code: codeCell, data: new Cell() });
    let res = await executor.get('init_Sample', __stack, { debug: true });
    if (res.debugLogs.length > 0) { console.warn(res.debugLogs); }
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

export const Sample_errors: { [key: string]: string } = {
    '2': `Stack undeflow`,
    '3': `Stack overflow`,
    '4': `Integer overflow`,
    '5': `Integer out of expected range`,
    '6': `Invalid opcode`,
    '7': `Type check error`,
    '8': `Cell overflow`,
    '9': `Cell underflow`,
    '10': `Dictionary error`,
    '13': `Out of gas error`,
    '32': `Method ID not found`,
    '34': `Action is invalid or not supported`,
    '37': `Not enough TON`,
    '38': `Not enough extra-currencies`,
    '128': `Null reference exception`,
    '129': `Invalid serialization prefix`,
    '130': `Invalid incoming message`,
    '131': `Constraints error`,
    '132': `Access denied`,
    '133': `Contract stopped`,
    '134': `Invalid argument`,
    '9290': `Need to point out the right ItemId`,
    '10987': `Not The Collection Contract`,
    '13164': `Not the Item Owner`,
    '16059': `Invalid value`,
    '24541': `Invalid sender, only Collection Address can call`,
    '51134': `not the owner`,
    '62742': `non-sequential NFTs`,
}

export class Sample {
    readonly executor: ContractExecutor; 
    constructor(executor: ContractExecutor) { this.executor = executor; } 
    
    async send(args: { amount: BN, from?: Address, debug?: boolean }, message: 'Mint' | TransferTo | UpdateCollectionContent | UpdateRoyaltyParams) {
        let body: Cell | null = null;
        if (message === 'Mint') {
            body = beginCell().storeUint(0, 32).storeBuffer(Buffer.from(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TransferTo') {
            body = packTransferTo(message);
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UpdateCollectionContent') {
            body = packUpdateCollectionContent(message);
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UpdateRoyaltyParams') {
            body = packUpdateRoyaltyParams(message);
        }
        if (body === null) { throw new Error('Invalid message type'); }
        try {
            let r = await this.executor.internal(new InternalMessage({
                to: this.executor.address,
                from: args.from || this.executor.address,
                bounce: false,
                value: args.amount,
                body: new CommonMessageInfo({
                    body: new CellMessage(body!)
                })
            }), { debug: args.debug });
            if (r.debugLogs.length > 0) { console.warn(r.debugLogs); }
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Sample_errors[e.exitCode.toString()]) {
                    throw new Error(Sample_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
    async getGetCollectionData() {
        try {
            let __stack: StackItem[] = [];
            let result = await this.executor.get('get_collection_data', __stack, { debug: true });
            if (result.debugLogs.length > 0) { console.warn(result.debugLogs); }
            return unpackStackCollectionData(result.stack);
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Sample_errors[e.exitCode.toString()]) {
                    throw new Error(Sample_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
    async getGetNftAddressByIndex(item_index: BN) {
        try {
            let __stack: StackItem[] = [];
            __stack.push({ type: 'int', value: item_index });
            let result = await this.executor.get('get_nft_address_by_index', __stack, { debug: true });
            if (result.debugLogs.length > 0) { console.warn(result.debugLogs); }
            return result.stack.readAddressOpt();
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Sample_errors[e.exitCode.toString()]) {
                    throw new Error(Sample_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
    async getGetNftContent(item_index: BN, individual_content: Cell) {
        try {
            let __stack: StackItem[] = [];
            __stack.push({ type: 'int', value: item_index });
            __stack.push({ type: 'cell', cell: individual_content });
            let result = await this.executor.get('get_nft_content', __stack, { debug: true });
            if (result.debugLogs.length > 0) { console.warn(result.debugLogs); }
            return result.stack.readCellOpt();
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Sample_errors[e.exitCode.toString()]) {
                    throw new Error(Sample_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
    async getGetCollectionAddress() {
        try {
            let __stack: StackItem[] = [];
            let result = await this.executor.get('getCollectionAddress', __stack, { debug: true });
            if (result.debugLogs.length > 0) { console.warn(result.debugLogs); }
            return result.stack.readAddress();
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Sample_errors[e.exitCode.toString()]) {
                    throw new Error(Sample_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
}