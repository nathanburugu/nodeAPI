import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers';


export const login = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.sendStatus(400);
      }
  
      const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
  
      if (!user) {
        return res.sendStatus(400);
      }
  
      const expectedHash = authentication(user.authentication.salt, password);
      
      if (user.authentication.password != expectedHash) {
        return res.sendStatus(403);
      }
  
      const salt = random();
      user.authentication.sessionToken = authentication(salt, user._id.toString());
  
      await user.save();
  
      res.cookie('ANTONIO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
  
      return res.status(200).json(user).end();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };

export const register = async (req: express.Request, res: express.Response) => {
    try {
        // registration process
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: 'Username, email and password are required.' });
        }

        // check if user exists
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).send({ message: 'User already exists.' });
        }

        // create user
        const salt = random();
        const user = await createUser({
            username,
            email,
            authentication: {
                password: authentication(password, salt),
                salt,
            },
        });

        return res.status(200).send(user);

        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);       
    }
}