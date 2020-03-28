import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import ReactTable from 'react-table'
import api from '../api'
import Moment from 'moment'

import styled from 'styled-components'

import 'react-table/react-table.css'

const Wrapper = styled.div`
    padding: 2% 20% 10% 20%;
    text-align: center;
    font-size: 12px;
`

class Block extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: '',
            block: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        const { pathname } = this.props.location;
        const height = pathname.replace('/api/block/', '');
        this.setState({
            height,
        });
        this.setState({ isLoading: true })

        await api.getBlock(height).then(block => {
            this.setState({
                block: [block.data.data],
                isLoading: false,
            })
        })
    }

    render() {
        const { block, isLoading } = this.state
        console.log('TCL: Block -> render -> block', block)

        const columns = [
            {
                Header: 'Block Height',
                accessor: 'height',
                width: 90,
            },
            {
                Header: 'Date/Time Forged',
                accessor: 'timestamp',
                width: 275,
                Cell: function(props) {
                    return (
                        <span>
                            {Moment.unix(props.original.timestamp + 1508609968).utcOffset('+0500').format('dddd, MMMM Do, YYYY h:mm:ss UTC')}
                        </span>
                    )
                },
            },
            {
                Header: 'Fees',
                accessor: 'totalFeeNQT',
                width: 50,
                Cell: function(props) {
                    return (
                        <span>
                            {props.original.totalFeeNQT/100000000 || 0} JUP
                        </span>
                    )
                },
                filterable: false,
            },
            {
                Header: 'Amount',
                accessor: 'amountNQT',
                width: 125,
                Cell: function(props) {
                    return (
                        <span>
                            {props.original.amountNQT/100000000 || 0} JUP
                        </span>
                    )
                },
                filterable: false,
            },
            {
                Header: 'Transactions',
                accessor: 'transactions',
                width: 150,
                Cell: function(props) {
                    return (
                        <span>
                            <Link to={`/api/tx/${props.original.transactions}`}>{props.value.join(', ') || 'None'}</Link>
                        </span>
                    )
                },
                style: { 'whiteSpace': 'unset' }
            },
            {
                Header: 'Generator',
                accessor: 'generatorRS',
                width: 200,
                Cell: function(props) {
                    return (
                        <span>
                            <Link to={`/api/account/${props.original.generatorRS}`}>{props.original.generatorRS}</Link>
                        </span>
                    )
                },
            },
            {
                Header: 'Payload Hash',
                accessor: 'block',
            },
        ]

        let showTable = true
        if (!block.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={block}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={1}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default Block
