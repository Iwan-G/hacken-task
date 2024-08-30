import React, { useEffect, useState } from 'react';
import { Table, Select, Typography, Image } from 'antd';
import 'antd/dist/reset.css';
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

const App: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currency, setCurrency] = useState('usd'); // Default to USD
  const [sortOrder, setSortOrder] = useState('market_cap_desc'); // Default to Market Cap Descending
  const totalRecords = 10000;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${sortOrder}&per_page=10&page=${currentPage}&sparkline=false`
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, currency, sortOrder]);

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center,', gap: '16px' }}>
          <Image
            width={30}
            src={record.image}
            alt={record.name}
            style={{ marginRight: 8 }}
            preview={{
              mask: null,
              maskClassName: 'custom-image-mask',
            }}
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Current Price',
      dataIndex: 'current_price',
      key: 'current_price',
      render: (price: number) => `${price} ${currency.toLowerCase()}`,
    },
    {
      title: 'Circulating Supply',
      dataIndex: 'circulating_supply',
      key: 'circulating_supply',
      render: (supply: number) => supply.toFixed(2),
    },
  ];

  return (
    <>
    <Title level={3}>Coins & Markets</Title>
      <div style={{ marginBottom: 16, display: 'flex', gap: '24px' }}>
        <Select
          value={currency}
          onChange={handleCurrencyChange}
          style={{ width: 200 }}
        >
          <Option value="usd">USD</Option>
          <Option value="eur">EUR</Option>
        </Select>
        <Select
          value={sortOrder}
          onChange={handleSortOrderChange}
          style={{ width: 200 }}
        >
          <Option value="market_cap_desc">Market Cap Descending</Option>
          <Option value="market_cap_asc">Market Cap Ascending</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          total: totalRecords,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </>
  );
};

export default App;
