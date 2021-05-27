import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';

const signInUrl =
    'http://shumiq.synology.me:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=shumiq_guest&passwd=santiphapsk131&session=FileStation&format=sid';

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const signInRes = await axios.get(signInUrl);
    res.send(signInRes.data);
};
