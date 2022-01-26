import React  from 'react';
import type {  GetServerSideProps } from 'next'
import { Row, Col, PageHeader, Typography, Card } from 'antd'
import placeholderImage from '../../public/placeholder-image.png'
import moment from "moment";
import { useRouter } from 'next/router'


interface dataProps {
    image_url?: string | null
    title?: string
    aic_start_at?: Date
    aic_end_at?: Date
    description?: string
}
interface detailProps {
    data?: dataProps
    message?: string
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const {  query } = context;

    let searchResult: object | null = null;
    let message: string = "Something went wrong"
    if (query.id) {
        await fetch(`https://api.artic.edu/api/v1/exhibitions/${query.id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.status >= 400 && json.status < 405) {
                    message = json.detail;
                } else {
                    searchResult = json.data;
                    message = "successfull";
                }
            }).catch((err) => console.log("the err", err))
    }
    return {
        props: {
            data: searchResult,
            message: message
        }, // will be passed to the page component as props
    }
}

const Exihibition = (props: detailProps) => {
    const router = useRouter()
    const { data, message } = props;

    return (
        <>
            <Row align="middle" className="page-header-row">
                <Col span={24}>
                    <PageHeader
                        onBack={() => router.push('/')}
                        className="site-page-header"
                        title={data?.title ? data.title : "No record found"}
                    />
                </Col>
            </Row>
            <Row className="main-card-wrapper" justify="space-between" gutter={20}>
                {props.data ?
                    <>
                        <Col span={24}>
                            <Typography.Title  >
                                {data?.title}
                                <span className="start">
                                    {data?.aic_start_at ? moment(data.aic_start_at).format('DD.MM.YYYY') : ""}
                                </span>
                                <span className="gap">
                                    —
                                </span>
                                <span className="end">
                                    {data?.aic_end_at ? moment(data.aic_end_at).format('DD.MM.YYYY') : ""}
                                </span>
                            </Typography.Title>
                        </Col>
                        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
                            <Card
                                style={{ width: "100%" }}
                                bordered={false}
                                cover={<img alt="example" src={data?.image_url ? data.image_url : placeholderImage.src} />}
                            >
                            </Card>
                        </Col>
                        <Col xl={18} lg={18} md={16} sm={12} xs={24}>
                            <p className="desc">{data?.description}</p>
                        </Col>
                    </> : <p>{props.message}</p>
                }
            </Row>
        </>
    )
}

export default Exihibition
