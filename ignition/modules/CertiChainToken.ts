import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CertiChainTokenModule", (m) => {
  // El deployer será el propietario inicial del contrato
  const deployer = m.getAccount(0);
  
  const certiChainToken = m.contract("CertiChainToken", [deployer]);

  return { certiChainToken };
});
