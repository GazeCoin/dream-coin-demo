pragma solidity ^0.4.23;

/**
 * @title ApproveAndCallFallback
 * @dev Interface function called from `approveAndCall` notifying that the approval happened
 */
contract ApproveAndCallFallback {
    function receiveApproval(address _from, uint256 _amount, address _tokenContract, bytes _data) public returns (bool);
}