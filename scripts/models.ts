interface IPoint {
    x: number;
    y: number;
    artistid?: number;
}

interface IArtist {
    id: number;
    rgb: string;
    PreviousPoint?: IPoint;
}