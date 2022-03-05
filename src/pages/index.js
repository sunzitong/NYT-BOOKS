import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Input, Form, Spin } from 'antd';
import styles from './index.less';

const { Option } = Select;
function Homepage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortLiet, setSortList] = useState([]);
  const [sortType, setSortType] = useState('rank');
  const [sortText, setSortText] = useState('');
  const fetData = async () => {
    const result = await axios.get('https://api.nytimes.com/svc/books/v3/lists/current/paperback-nonfiction.json?api-key=TCA6F3ERSCl405KagmGI7MIe8rn2bu2U')
    const { data = {} } = result || {};
    const { results = {} } = data || {};
    const { books = [] } = results || {};
    setLoading(false);
    setList(books);
    setSortList(books);
  }

  useEffect(() => {
    fetData();
  }, []);

  useEffect(() => {
    if (sortType === 'rank') {
      setSortList(list);
      return;
    }
    if (['title', 'author'].includes(sortType)) {
      let data = list.filter((item) => {
        return item[sortType].toLocaleLowerCase().includes(sortText.toLocaleLowerCase());
      })
      setSortList(data);
      return;
    }
    if (sortType === 'isbns' && sortText) {
      let data = list.filter((item) => {
        let array = [];
        item[sortType].forEach(item => {
          array.push(item.isbn10);
          array.push(item.isbn13);
        })
        return array.includes(sortText.toLocaleLowerCase())
      })
      setSortList(data);
    } else {
      setSortList(list);
    }
  }, [sortText, sortType]);

  return (
    <div className={styles.container}>
      <h2>Paperback Nonfiction Bestsellers</h2>
      <div
        className={styles['form-container']}
      >
        <Form
          layout='inline'
        >
          <Form.Item
            label="Sort by"

          >
            <Select value={sortType} style={{ width: 120 }} onChange={(e) => {
              setSortText('');
              setSortType(e);
            }}>
              <Option value="rank">Rank</Option>
              <Option value="title">Title</Option>
              <Option value="author">Author</Option>
              <Option value="isbns">ISBN</Option>
            </Select>
          </Form.Item>
          {
            sortType !== 'rank' && (
              <Form.Item>
                <Input
                  placeholder={`please enter ${sortType}`}
                  value={sortText}
                  onInput={e => { setSortText(e.target.value) }} />
              </Form.Item>
            )
          }
        </Form>
      </div>
      <div
        className={styles['list-container']}
      >
        {loading && <Spin />}
        {
          sortLiet.map((item) => {
            const { rank = '', title = '', book_image = '', contributor = '', description = '', primary_isbn10 = '' } = item || {};
            return (
              <div className={styles['item-container']} key={primary_isbn10}>
                <span>{`${rank}.`}</span>
                <img src={book_image} alt={title} />
                <div>
                  <p className={styles.title}>{title}</p>
                  <p className={styles.contributor}>{contributor}</p>
                  <p className={styles.description}>{description}</p>
                  <p className={styles.isbn}>{`ISBN:${primary_isbn10}`}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default Homepage;