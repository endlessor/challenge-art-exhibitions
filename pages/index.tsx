import type { GetServerSideProps, NextPage } from 'next'
import React from 'react';
import { Row, Col, PageHeader } from 'antd'
import Card from '../Components/CardComponent';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { resolvedUrl, query } = context;
  let page = 1;
  if (query.page)
    page = Number(query.page)

  let paginationData = {};
  let searchResult: Array<object> = [];
  let message: string = "Something went wrong"
  await fetch(`https://api.artic.edu/api/v1/exhibitions`)
    .then((res) => res.json())
    .then((json) => {
      if (json.status >= 400 && json.status < 405) {
        message = json.detail;
      } else {
        paginationData = json.pagination;
        searchResult = json.data
        message = "Successfull"
      }
    }).catch((err) => console.log("the err", err))
  return {
    props: {
      data: searchResult,
      pagination: paginationData,
      message: message
    }, // will be passed to the page component as props
  }
}
interface paginationProps {
  current_page?: number
  limit?: number
  next_url?: string
  offset?: number
  prev_url?: string
  total?: number
  total_pages?: number
}
interface homeProps {
  data?: Array<object>
  pagination?: paginationProps
  message?: string
}
const Home = (props: homeProps) => {
  const router = useRouter()
  const [artData, setArtData] = useState<object[] | undefined>([]);
  const [paginationData, setPaginationData] = useState<paginationProps>();
  useEffect(() => {
    setArtData(props?.data)
    setPaginationData(props?.pagination)
  }, [])
  const fetchData = async () => {
    if (paginationData?.next_url) {
      await fetch(`${paginationData?.next_url}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.status >= 400 && json.status < 405) {
            console.log("error occured");
          } else {
            if (artData && artData?.length > 0) {
              setArtData([...artData, ...json.data])
              setPaginationData(json.pagination)
            } else {
              setArtData([...json.data])
              setPaginationData(json.pagination)
            }
          }
        }).catch((err) => console.log("the err", err))
    }
  }

  return (
    <>
      <Row align="middle" className="page-header-row">
        <Col span={24}>
          <PageHeader
            className="site-page-header"
            title="Exhibitions!"
          />
        </Col>
      </Row>
      <InfiniteScroll
        dataLength={artData?.length || 0}
        next={async () => {
          await fetchData();
        }}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Row align="middle" className="main-card-wrapper" justify="center" gutter={40}>
          {(artData && artData?.length > 0) ?
            artData.map((item: { id?: number, image_url?: string | null, title?: string, aic_start_at?: Date, aic_end_at?: Date }, index: number) => (
              <Col key={index} xl={6} lg={6} md={12} sm={12} xs={24}>
                <Card
                  onCardClick={() => {
                    router.push(`/exhibition/${item.id}`)
                  }}
                  image={item.image_url}
                  title={item.title}
                  startDate={item.aic_start_at}
                  endDate={item.aic_end_at} />
              </Col>
            )) :
            <p>{props.message}</p>
          }
        </Row>
      </InfiniteScroll>

    </>
  )
}

export default Home
