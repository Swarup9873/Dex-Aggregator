import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ContractsContext } from './ContractContext';
import { ethers } from 'ethers';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
`;

const Title = styled.h2`
    text-align: center;
    color: #333;
`;

const TransactionList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const TransactionItem = styled.li`
    background: #fff;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #007bff;
`;

const TransactionDetail = styled.p`
    margin: 5px 0;
    color: #555;
    font-size: 14px;
`;

const NoTransactions = styled.p`
    text-align: center;
    color: #999;
`;

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const provider = useSelector((state) => state.provider.connection);
    const account = useSelector((state) => state.provider.account);
    const contracts = useContext(ContractsContext);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!account || !provider) return;

            try {
                const txList = await provider.getHistory(account);
                setTransactions(txList);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [account, provider]);

    useEffect(() => {
        const fetchContractEvents = async () => {
            if (!contracts || !provider) return;

            try {
                const events = await contracts.dex.queryFilter(
                    contracts.dex.filters.Swap(null, account, null, null),
                    0,
                    'latest'
                );
                console.log('Contract events:', events);
                // Here, you can process the events and add them to the transactions list or display them separately
            } catch (error) {
                console.error('Error fetching contract events:', error);
            }
        };

        fetchContractEvents();
    }, [contracts, provider, account]);

    return (
        <Container>
            <Title>Transactions</Title>
            {transactions.length === 0 ? (
                <NoTransactions>No transactions to display at the moment.</NoTransactions>
            ) : (
                <TransactionList>
                    {transactions.map((tx, index) => (
                        <TransactionItem key={index}>
                            <TransactionDetail>Hash: {tx.hash}</TransactionDetail>
                            <TransactionDetail>Block Number: {tx.blockNumber}</TransactionDetail>
                            <TransactionDetail>From: {tx.from}</TransactionDetail>
                            <TransactionDetail>To: {tx.to}</TransactionDetail>
                            <TransactionDetail>Value: {ethers.formatEther(tx.value)} ETH</TransactionDetail>
                        </TransactionItem>
                    ))}
                </TransactionList>
            )}
        </Container>
    );
};

export default Transactions;
