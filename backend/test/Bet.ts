import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { BaseContract, ContractFactory } from "ethers";

interface ILock extends BaseContract {
  withdraw(): Promise<void>;
  unlockTime(): Promise<number>;
  owner(): Promise<string>;
}

describe("Lock", function () {
  // Definimos uma fixture para reutilizar a mesma configuração em todos os testes.
  // Usamos loadFixture para executar esta configuração uma vez, fazer snapshot do estado,
  // e resetar a Hardhat Network para esse snapshot em cada teste.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contratos são implantados usando a primeira conta/signer por padrão
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Lock = await hre.ethers.getContractFactory("Lock");
    const lock = (await Lock.deploy(unlockTime, { value: lockedAmount })) as unknown as ILock;

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Implantação", function () {
    it("Deve definir o tempo de desbloqueio correto", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Deve definir o proprietário correto", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Deve receber e armazenar os fundos para bloquear", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(
        lockedAmount
      );
    });

    it("Deve falhar se o tempo de desbloqueio não estiver no futuro", async function () {
      // Não usamos a fixture aqui porque queremos uma implantação diferente
      const latestTime = await time.latest();
      const Lock = await hre.ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Saques", function () {
    describe("Validações", function () {
      it("Deve reverter com o erro correto se chamado muito cedo", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Deve reverter com o erro correto se chamado de outra conta", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );

        // Podemos aumentar o tempo na Hardhat Network
        await time.increaseTo(unlockTime);

        // Usamos lock.connect() para enviar uma transação de outra conta
        await expect((lock.connect(otherAccount) as ILock).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Não deve falhar se o tempo de desbloqueio chegou e o proprietário o chama", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transações são enviadas usando o primeiro signer por padrão
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Eventos", function () {
      it("Deve emitir um evento nos saques", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // Aceitamos qualquer valor como argumento 'when'
      });
    });

    describe("Transferências", function () {
      it("Deve transferir os fundos para o proprietário", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
