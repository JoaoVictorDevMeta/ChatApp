import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate, Link } from 'react-router-dom'

import backImage from '../assets/sl_0210121_40570_58.jpg' 
import Swal from 'sweetalert2';

type Inputs = {
    email: string,
    password: string,
}

function Login() {
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Inputs>({
        mode: "onBlur",
    })

    const loginUser: SubmitHandler<Inputs> = async ( data ) => {
        setLoading(true)

        try{
            await signInWithEmailAndPassword(auth, data.email, data.password) 
            Swal.fire({
                icon: "success",
                title: "Logado com sucesso",
            }).then(() =>{
                navigate('/home')
            })
        }catch(e){
            console.log(e)
            Swal.fire({
                icon: "error",
                title: "algo deu errado",
            })
        }
        
        setLoading(false)
    }

  return (
    <div className="formContainer">
        <div className='background'>
            <img src={backImage} alt="" />
        </div>
        <div className='formWrapper'>
            <div>
                <h1>FumeVersa</h1>
                <h2>Bem vindo de volta!</h2>
            </div>   

            <form onSubmit={handleSubmit(loginUser)}>
                <div className='input-field'>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id='email' 
                        {...register("email",
                            { required: true },
                        )}
                    />
                    <small>
                        {errors.email?.type === "required" && <span>Campo Obrigatório</span>}
                    </small>
                </div>
                <div className='input-field'>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id='password'
                        {...register("password",
                            { required: true },
                        )}
                    />
                    <small>
                        {errors.password?.type === "required" && <span>Campo Obrigatório</span>}
                    </small>
                </div>
                <hr />
                <button type="submit" disabled={!isValid} className='login-submit'>
                {loading ? '...' : "Acessar"}
                </button>
            </form>
            <p>Não tem conta? <Link to="/register">Registrar-se</Link></p>
        </div>
    </div>
  )
}

export default Login