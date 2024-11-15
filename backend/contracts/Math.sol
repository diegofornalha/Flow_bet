// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
 * @title Matemática
 * @dev Operações matemáticas com verificações de segurança que lançam erro em caso de falha
 */
library Math {
    /**
     * @dev Multiplica dois números, lança erro em caso de overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        // Otimização de Gas: isso é mais barato do que verificar se 'a' não é zero,
        // mas o benefício é perdido se 'b' também for testado.
        // Veja: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
     * @dev Divisão inteira de dois números, truncando o quociente.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automaticamente lança erro quando divide por 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // Não há caso em que isso não seja verdadeiro
        return a / b;
    }

    /**
     * @dev Subtrai dois números, lança erro em caso de overflow
     * (ou seja, se o subtraendo for maior que o minuendo).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
     * @dev Adiciona dois números, lança erro em caso de overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}
