import './styles.css'
import Logo from '../../assets/logo.svg'
import { useState } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Inputs from '../../components/Inputs'



export default function SignUp() {
    const navigate = useNavigate();
    const [forms, setForms] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmacao: ''
    })

    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!forms.nome || !forms.email || !forms.senha || !forms.confirmacao) {
            setError('Todos os campos são obrigatórios');
            console.log(error);
            return;
        }

        if (forms.senha !== forms.confirmacao) {
            setError('Senha não confirmada!');
            console.log(error);
            return;
        }

        handleClear()
    }

    function handleChangeForm(e) {
        const value = e.target.value;

        setForms({
            ...forms,
            [e.target.name]: value
        });
    }

    function handleClear() {
        setForms({
            nome: '',
            email: '',
            senha: '',
            confirmacao: ''
        });

        handleApi();
    }

    async function handleApi() {
        try {
            const response = await api.post('/usuario', {
                nome: forms.nome,
                email: forms.email,
                senha: forms.senha
            });

            console.log(response);
            navigate('/login')

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container'>
            <img src={Logo} alt='logo' />

            <div className='container-signUp'>
                <div className='container-forms'>
                    <h1>Cadastre-se</h1>
                    <form onSubmit={handleSubmit} >

                        <Inputs
                            type='text'
                            name='nome'
                            label='Nome'
                            id='nome'
                            value={forms.nome}
                            handleChangeForm={handleChangeForm}
                        />

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
                        <Inputs
                            type='password'
                            name='confirmacao'
                            label='Confirmar Senha'
                            id='confirmacao'
                            value={forms.confirmacao}
                            handleChangeForm={handleChangeForm}
                        />
                        <button type='submit'>Cadastrar</button>
                        <div className='link'>
                            <Link to='/login'>Já tem cadastro? Clique aqui!</Link>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}