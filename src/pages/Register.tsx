import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from '../firebase'
import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom";

import defaultImage from '../assets/default.png'
import backImage from '../assets/sl_0210121_40570_58.jpg' 

type Inputs = {
    nome: string,
    email: string,
    password: string,
}

function Register() {
    const [ image, setImage ] = useState<File | undefined>(undefined);
    const [ imageUrl, setImageUrl ] = useState<string>("")
    const [ err, setErr ] = useState(false) 
    const [ loading, setLoading ] = useState(false)
    const [ percent, setFilePercent ] = useState(0)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Inputs>({
        mode: "onBlur",
    })

    const registerUser: SubmitHandler<Inputs> = async ( data ) => {
        const { email, password, nome } = data;
        setLoading(true)
        try{
            const res = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(res.user, {
                displayName: nome,
                photoURL: imageUrl,
            });
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                nome,
                email,
                photoURL: imageUrl,
            })
            await setDoc(doc(db, "userChats", res.user.uid), {})

            navigate('/home')
        }catch(err){
            setErr(true)
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (image) {
          handleFileUpload(image);
        }
      }, [image]);    

    const handleFileUpload = async(image:File) => {
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePercent(Math.round(progress));
        },
        () => {},
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL:string) => {
            setImageUrl(downloadURL);
        });
        });
    }

  return (
    <div className="formContainer">
        <div className='background'>
            <img src={backImage} alt="" />
            {err && <span className="formErr">Algo deu errado</span>}
        </div>
        <div className='formWrapper'>
            <div>
                <h1>FumeVersa</h1>
                <h2>Crie sua conta</h2>
            </div>   

            <form onSubmit={handleSubmit(registerUser)}>
                <div className='input-field'>
                    <label htmlFor="nome">Primeiro nome</label>
                    <input 
                        type="text" 
                        id='nome'
                        {...register("nome", 
                            { required: true, maxLength: 20 }
                        )}
                    />
                    <small>
                        {errors.nome?.type === "required" && <span>Campo Obrigatório</span>}
                        {errors.nome?.type === "maxLength" && <span>Nome muito longo</span>}
                    </small>
                </div>
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
                    <label htmlFor="password">Senha</label>
                    <input 
                        type="password" 
                        id='password'
                        {...register("password",
                            { required: true},
                        )}
                    />
                    <small>
                        {errors.password?.type === "required" && <span>Campo Obrigatório</span>}
                        {errors.password?.type === "minLenght" && <span>Senha muito pequena</span>}
                    </small>
                </div>
                <div className='input-file'>
                    <input type="file" 
                        name="userImage" 
                        id="file" 
                        hidden
                        accept='image/*'
                        onChange={(e) => {
                            if (e.target.files) {
                                setImage(e.target.files[0]);
                            }
                        }}
                    />
                    <label htmlFor="file"><img src={imageUrl || defaultImage} alt="defaultImage" /></label>
                    <p>{percent == 100 ? "upload succed" : percent ? "% "+percent : "add your image"}</p>
                </div>
                <button type="submit" disabled={!isValid}>
                    {loading ? '...' : "Criar Conta"}
                </button>
            </form>
            <p>Ja tem conta? <Link to="/login">Logar-se</Link></p>
        </div>
    </div>
  )
}

export default Register