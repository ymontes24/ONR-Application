import { ProjectionType } from "mongoose";

export const amenityProjection: ProjectionType<{ [key: string]: number | string }> = {
    id: '$_id',
    _id: 0,
    name: 1,
    description: 1,
    bookable: 1,
    openingTime: 1,
    closingTime: 1,
    associationId: 1,
};

export const bookingProjection: ProjectionType<{ [key: string]: number | string }> = {
    _id: 0,
    id: '$_id',
    date: 1,
    timeStart: 1,
    timeEnd: 1,
    userId: 1,
    amenityId: 1,
    groupingId: 1,
}