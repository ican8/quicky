// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.8.0;


/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Quicky {
    
    uint public no_of_persons;
    uint public no_of_companies;
    uint public no_of_records;
    
    enum State { PENDING,APPROVED,REJECTED}
    
    struct Person {
        uint id;
        address ac;
        string name;
        // hash of ipfs document
        string identity;
        // string company;
        // string start_date;
    }
    
    struct Company {
        uint id;
        address ac;
        string name;
        // hash of ipfs document
        string identity;
        string website;
    }
    struct Record {
        // hash of proof from ipfs
        uint id;
        string proof;
        address employee;
        string employer;
        State state;
    }
    
    mapping(address => Person) public persons;
    mapping(address => Company) public companies;
    mapping(uint => Record) public records;
    mapping(address => bool) public is_company;
    mapping(address => bool) public is_person;
    
    address[] public person_list;
    address[] public company_list;
    Record[] public record_list;
    
    function createPerson(
        string memory _name,
        string memory _identity
    ) 
    public{
         require(
            !( is_company[msg.sender] ),
            "Company can't be a person."
        );
        require(
            !( is_person[msg.sender] ),
            "You are already registered."
        );
        no_of_persons += 1;
        persons[msg.sender] = Person(
            no_of_persons, // id
             msg.sender,  // ac
            _name,
            _identity
        );
        is_person[msg.sender] = true;
        person_list.push(msg.sender);
    }
    
    function createCompany(
        string memory _name,
        string memory _identity,
        string memory _website
    ) 
    public{
        require(
            !( is_person[msg.sender] ),
            "Person can't be a Company."
        );
        require(
            !( is_company[msg.sender] ),
            "You are already registered."
        );
        no_of_companies += 1;
        companies[msg.sender] = Company(
            no_of_companies, // id
             msg.sender,  // ac
            _name,
            _identity,
            _website
        );
        is_company[msg.sender] = true;
        company_list.push(msg.sender);
    }
    
    function createRecord(
        string memory _employer,
        string memory _proof
    ) 
    public{
        // require(
        //     ( is_person[msg.sender] ),
        //     "Only person can create record"
        // );
        no_of_records += 1;
        //      uint id;
        //     string proof;
        //     address employee;
        //     string employer;
        //     State state;
        records[no_of_records] = Record(
                 no_of_records,
                _proof,
                msg.sender, // employee
                _employer,
                State.PENDING
        );
        record_list.push(records[no_of_records]);
    }
    
    constructor() public {
        no_of_persons = 0;
        no_of_companies = 0;
        no_of_records = 0;
    }

    function getPersonCount() public view returns (uint)
    {
        return no_of_persons;
    }
    function getCompanyCount() public view returns (uint)
    {
        return no_of_companies;
    }
    function getRecordCount() public view returns (uint)
    {
        return no_of_records;
    }
    function check_is_person(address _addr) public view returns (bool){
        return is_person[_addr];
    }
    function check_is_company(address _addr) public view returns (bool){
        return is_company[_addr];
    }
    function getRecord(uint i) public view returns (string memory,address,string memory,State) {
        return (record_list[i].proof, record_list[i].employee, record_list[i].employer,record_list[i].state);
    }

    function getName(address _addr) public view returns(string memory){
        return companies[_addr].name;
    }
}