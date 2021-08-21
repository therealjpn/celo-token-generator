// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;


contract TokenList {
    // initiazlize the tokenLength, defaults to 0
    uint256 internal tokenLength;
    
    struct Token {
        uint index;
        address owner;
        string tokenName;
        string tokenSymbol;
        uint decimals;
        uint totalSupply;
    }

    mapping(uint => Token) internal tokenMap;



    function addTokenList(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint _totalSupply
        ) public {
            uint _index = tokenLength;
            tokenMap[tokenLength] = Token(
                _index,
                payable(msg.sender),
                _tokenName,
                _tokenSymbol,
               
                18,
                _totalSupply
            );
        tokenLength ++;
    }
    
    
        function getTokenLength() public view returns(uint) {
        return tokenLength;
    }
    
        function getToken(uint _id) 
        public  view returns (
        uint _index,
        address _owner, 
        string memory _tokenName,
        string memory _tokenSymbol,
        uint _totalSupply
    ) {


        require(_id >= 0, "Please enter a valid id");

        Token storage token = tokenMap[_id];
        
        return (
            token.index, 
            token.owner, 
            token.tokenName, 
            token.tokenSymbol, 
            token.totalSupply
        );
    }
    
}
        