import React from 'react';
import { VERIFY_ACCOUNT } from '../../GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import {useParams} from 'react-router-dom';

interface Params{
    token: string
}

interface ErrorMessage{
    message: string;
    code: string;
}

export default function VerifyAccount(){
    const [errors, setErrors] = React.useState<Array<string>>([]);
    const [verify, { data, loading, error }] = useMutation(VERIFY_ACCOUNT);
    const {token} = useParams<Params>();

    React.useEffect(() => {
        if(!data && verify && token){
            // verifying the token
            verify({
                variables: {
                    token
                }
            });
        }else if(data && data.verifyAccount){
            if(data.verifyAccount.success){
                console.log("Verified");
            }else{
                let error_fields = data.verifyAccount.errors;
                let error_msgs: Array<string> = [];

                for (const key in error_fields) {
                const msgs: Array<ErrorMessage> = error_fields[key];
                msgs.forEach((msg) => error_msgs.push(msg.message));
                }

                setErrors(error_msgs);
            }
        }
    }, [data, loading, verify, token]);

    if(error) {
        console.log(error);
        return <p>Something went wrong. Try Again</p>
    }

    if(loading){
        return <p>Verifying....</p>
    }
    return <div>{errors && errors.map((err:string, index: number) => <p key={index}>{err}</p>)}</div>
}