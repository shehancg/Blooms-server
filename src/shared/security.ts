import jwt from 'jsonwebtoken';

// Set a secret key for signing and verifying JWTs
const secretKey = 'my-secret-key';

// Authenticate a user and return a JWT
function generateToken(payload: object): string {

    try {
        //create a JWT containing the user's id and other claims
        return jwt.sign(payload, secretKey);
    } catch (error:any) {
        throw new Error(error.message)
    }

}

// Verify a JWT and return the decoded payload
function verify(req: any, res: any, next: any) {
    try {
        // const token = req.cookies.accessToken
        const authorization = req.headers.authorization as string;
        const token = authorization.split(" ")[1];

        // Verify the JWT and return the decoded payload
        req.user = jwt.verify(token, secretKey)
        next()
    } catch (err:any) {
        // If the JWT is invalid, return an error
        // throw new Error('Invalid token');
        res.status(401)
        res.statusMessage = "Invalid token"
        res.json({
            message: err.message
        })
        res.end()
    }
}

// function verify(req: any, res: any, next: any) {
//     const token = req.headers.access_token as string;
//     if(!token) return res.status(401).send();

//     try {
//         const decodedUser = verify(token, process.env.JWT_SECRET!);
//         req.user = decodedUser;

//     } catch (error) {
//         res.status(401).send();
//     }

//     return next();
// }

export {
    generateToken,
    verify
};
