import { contractAddress, toNano } from "ton";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import { randomAddress } from "./utils/randomAddress";
import { Sample_init } from "./output/sample_Sample";

(async () => {
  // Parameters
  let owner = randomAddress(0, "some-owner"); // Replace owner with your address

  //   let packed = packAdd({ $$type: "Add", amount: 10n }); // Replace if you want another message used
  let init = await Sample_init(
    owner,
    true, // Setting: Is this collection NFT is seriazlied in ItemId?
    null, // Setting: Content for NFT Collection. DataType: Cell
    null // Setting: Royalty Setting. DataType: Cell
  );
  let address = contractAddress({
    workchain: 0,
    initialCode: init.code,
    initialData: init.data,
  });
  let deployAmount = toNano(0.5);
  let testnet = true;

  // Print basics
  printHeader("Sample NFTs");
  printAddress(address);
  printDeploy(init, deployAmount, "", testnet);
})();
