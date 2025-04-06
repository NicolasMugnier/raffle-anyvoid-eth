export interface RaffleResult {
    owner: {
        username: string;
        fid: number;
    },
    participants: {
        name: string;
    }[],
    winner: {
        name: string;
    },
    date: string;
}
