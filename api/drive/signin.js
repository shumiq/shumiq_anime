import axios from 'axios';

const signInUrl =
  'https://shumiq.synology.me:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=shumiq_guest&passwd=santiphapsk131&session=FileStation&format=sid';

const adminSignInUrl =
    'https://shumiq.synology.me:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=shumiq&passwd=__PASSWORD__&otp_code=__OTP__&session=FileStation&format=sid';


export default async (req, res) => {
  const isAdmin = req.query.admin.toString() === "true";
  const password = req.query.password.toString();
  const otp = req.query.otp.toString();
  if(isAdmin) {
    const signInRes = await axios.get(adminSignInUrl.replace("__PASSWORD__",password).replace("__OTP__",otp));
    res.send(signInRes.data);
  } else {
    const signInRes = await axios.get(signInUrl);
    res.send(signInRes.data);
  }
};
