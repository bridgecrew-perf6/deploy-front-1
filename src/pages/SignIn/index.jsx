import './styles.css'
import Logo from '../../assets/logo.svg'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { getItem, setItem } from '../../utils/storage'
import { useNavigate, Link } from 'react-router-dom'
import Inputs from '../../components/Inputs'

export default function SignIn() {

    const [forms, setForms] = useState({
        email: '',
        senha: ''
    })
    const navigate = useNavigate();

    function handleChangeForm(e) {
        const value = e.target.value;

        setForms({
            ...forms,
            [e.target.name]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (!forms.email || !forms.senha) {
                return;
            }

            const response = await api.post('/login', {
                email: forms.email,
                senha: forms.senha
            })

            console.log(response.data);
            const { token, usuario } = response.data
            setItem('token', token);
            setItem('userId', usuario.id)
            navigate('/main');

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const token = getItem('token');

        if (token) {
            navigate('/main');
        }

    });

    return (
        <div className='container-signIn'>
            <img src={Logo} alt='logo' />
            <div className='container-geral'>
                <div className='info'>
                    <h1>Controle suas <span >finanças</span>,
                        sem planilha chata.</h1>
                    <p>Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem tudo num único lugar e em um clique de distância.</p>
                    <button><Link to='/'>Cadastre-se</Link></button>
                </div>
                <div className='forms'>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <Inputs
                            type='email'
                            name='email'
                            label='E-mail'
                            id='email'
                            value={forms.email}
                            handleChangeForm={handleChangeForm}
                        />
                        <Inputs
                            type='password'
                            name='senha'
                            label='Senha'
                            id='senha'
                            value={forms.senha}
                            handleChangeForm={handleChangeForm}
                        />
                        <button>Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}