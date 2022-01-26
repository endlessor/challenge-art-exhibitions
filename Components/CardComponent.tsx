import React  from 'react';
import placeholderImage from '../public/placeholder-image.png'
import { Card } from 'antd';
import moment from "moment";

interface CardProps {
    image?: string | null
    title?: string
    startDate?: Date
    endDate?: Date
    onCardClick?: () => void
}

const CardComponent = (props: CardProps) => {

    const { image, title, startDate, endDate, onCardClick } = props;
    const { Meta } = Card;
    return (
        <Card
            style={{ width: "100%" }}
            bordered={false}
            cover={<img alt="example" src={image ? image : placeholderImage.src} />}
            onClick={onCardClick}
        >
            <Meta title={title ? title : ""} />
            <p className="date">
                <span className="start">
                    {startDate ? moment(startDate).format('DD.MM.YYYY') : ""}
                </span>
                <span className="gap">
                    -
                </span>
                <span className="end">
                    {endDate ? moment(endDate).format('DD.MM.YYYY') : ""}
                </span>
            </p>
        </Card>
    )
}

export default CardComponent
