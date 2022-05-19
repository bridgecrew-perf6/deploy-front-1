import './styles.css'
import Logo from '../../assets/logo.svg'
import api from '../../services/api'
import Profile from '../../assets/profile.svg'
import Exit from '../../assets/exit.svg'
import Filter from '../../assets/filter.svg'
import Arrow from '../../assets/arrow.svg'
import ArrowDown from '../../assets/arrowDown.svg'
import Pencil from '../../assets/pencil.svg'
import Bin from '../../assets/bin.svg'
import { useEffect, useState } from 'react'
import { handleFormatDate, handleFormatDayOfWeek } from '../../utils/formatDate'
import ModalExit from '../../assets/modalExit.svg'
import { useNavigate } from 'react-router-dom'
import { clear } from '../../utils/storage'
import { handleFormatNumber } from '../../utils/formatNumber'

export default function Main() {
    const navigate = useNavigate();

    const [sort, setSort] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [table, setTable] = useState([]);
    const [modal, setModal] = useState(false);
    const [typeModal, setTypeModal] = useState(true);
    const [modalEditUser, setModalEditUser] = useState(false);
    const [idEdit, setIdEdit] = useState(0);
    const [confirmacao, setConfirmacao] = useState(false);
    const [valores, setValores] = useState({
        entrada: 0,
        saida: 0,
        saldo: 0
    })
    const [forms, setForms] = useState({
        valor: '',
        data: '',
        categoria: '',
        descricao: ''
    });
    const [formsUser, setFormsUser] = useState({
        usuario: '',
        email: '',
        senha: '',
        confirmacao: ''
    });

    useEffect(() => {
        async function valor() {
            try {
                const response = await api.get('/transacao/extrato');
                setValores({
                    entrada: response.data.entrada,
                    saida: response.data.saida,
                    saldo: response.data.entrada - response.data.saida
                })
            } catch (error) {
                console.log(error.message);
            }
        }
        valor();

    }, [table]);

    useEffect(() => {

        async function dados() {
            try {
                const response = await api.get('/categoria')
                const responseTransacao = await api.get('/transacao')

                setCategorias(response.data);
                setTable(responseTransacao.data);


            } catch (error) {
                console.log(error.response.message);
            }
        }
        dados();
    }, []);

    function handleChangeForm(e) {
        const value = e.target.value;

        setForms({
            ...forms,
            [e.target.name]: value
        });

        setFormsUser({
            ...formsUser,
            [e.target.name]: value
        });

    }

    function handleChangeCategory(e) {
        const { id } = categorias.find((categoria) => {
            return categoria.id === Number(e.target.value);
        });

        setForms({
            ...forms,
            categoria: id
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await api.post('/transacao',
                {
                    descricao: forms.descricao,
                    valor: forms.valor,
                    data: forms.data,
                    categoria_id: forms.categoria,
                    tipo: confirmacao ? "entrada" : "saida"
                });
            setModal(false);
            setTable(table => [...table, response.data]);
        } catch (error) {
            console.log(error.message);
        }


        handleClear()
    }

    function handleClear() {
        setForms({
            valor: '',
            data: '',
            descricao: ''
        });
    }

    async function handleEdit(id) {
        setTypeModal(false);
        setModal(true);

        setIdEdit(id);
    }

    async function handleSubmitEdit(e) {
        e.preventDefault();

        try {
            const response = await api.put(`/transacao/${idEdit}`, {
                descricao: forms.descricao,
                valor: forms.valor,
                data: forms.data,
                categoria_id: forms.categoria,
                tipo: confirmacao ? "entrada" : "saida"
            })
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }

        setModal(false);
        handleClear()
    }

    async function handleRemove(id) {

        try {
            await api.delete(`/transacao/${id}`);
            const transacoes = [...table];
            const deleteTransacao = transacoes.filter((t) => {
                return t.id !== Number(id);
            });
            setTable(deleteTransacao);
        } catch (error) {
            console.log(error.message);
        }

        setModal(false);
        handleClear()
    }

    async function handleEditUser(e) {
        e.preventDefault();

        try {
            const response = await api.put('/usuario', {
                nome: formsUser.usuario,
                email: formsUser.email,
                senha: formsUser.senha
            })
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    function handleExitUser() {
        clear();
        navigate('/login');
    }

    function handleDateOrder() {
        const transacoes = [...table];
        setSort(!sort);
        transacoes.sort((a, b) => {
            const dateA = new Date(a.data);
            const dateB = new Date(b.data);
            return sort ? +dateB - +dateA : +dateA - +dateB
        });
        setTable(transacoes);
    }



    return (
        <div className='container-main'>
            <header>
                <div className='header-logo'>
                    <img src={Logo} alt='logo' />
                </div>
                <div className='header-profile'>
                    <img onClick={() => setModalEditUser(true)} src={Profile} alt='profile' />
                    <strong>Nome</strong>
                    <img onClick={handleExitUser} src={Exit} alt='exit' />
                </div>
            </header>
            <div className='container-body'>
                <div className='filter'>
                    <div>
                        <img src={Filter} alt='filter' />
                        <strong>Filtrar</strong>
                    </div>
                    <div className='hidden'></div>
                    <div className='row'>
                        <div className='table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th onClick={handleDateOrder}>Data <img src={sort ? Arrow : ArrowDown} alt='seta' /></th>
                                        <th>Dia da semana</th>
                                        <th>Descrição</th>
                                        <th>Categoria</th>
                                        <th>Valor</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {table.map((transacao) => (
                                    <tbody key={transacao.id}>
                                        <tr>
                                            <td>{handleFormatDate(transacao.data)}</td>
                                            <td>{handleFormatDayOfWeek(transacao.data)}</td>
                                            <td >{transacao.descricao}</td>
                                            <td>{transacao.categoria_nome}</td>
                                            <td id={transacao.tipo}>R$ {handleFormatNumber(transacao.valor)}</td>
                                            <td><img onClick={() => handleEdit(transacao.id)} src={Pencil} alt='Caneta' />
                                                <img onClick={() => handleRemove(transacao.id)} src={Bin} alt='lixeira' />
                                            </td>
                                        </tr>
                                    </tbody>

                                ))}
                            </table>

                        </div>
                        <div className='container-resumo'>
                            <div className='resumo'>
                                <h1>Resumo</h1>
                                <div className='container-infos'>
                                    <div className='infos'>
                                        <strong>Entradas</strong> <h4 id='entrada'>R$ {handleFormatNumber(valores.entrada)}</h4>
                                    </div>
                                    <div className='infos'>
                                        <strong>Saídas </strong> <h4 id='saida'>R$ {handleFormatNumber(valores.saida)}</h4>
                                    </div>
                                </div>
                                <div className='infos'>
                                    <strong>Saldo </strong> <h4 id='saldo'>R$ {handleFormatNumber(valores.saldo)}</h4>
                                </div>
                            </div>
                            <button onClick={() => setModal(true)}>Adicionar Registro</button>
                        </div>
                    </div>
                </div>
                {modal &&
                    <div className='container-modal'>
                        <div className='modal-resumo'>
                            <div className='modal-exit'>
                                <h1>{typeModal ? 'Adicionar Registro' : 'Editar Registro'}</h1>
                                <img onClick={() => setModal(false)} src={ModalExit} alt='fechar' />
                            </div>
                            <div className='buttons-modal'>
                                <button onClick={() => setConfirmacao(true)} id='btn-azul'>Entrada</button>
                                <button id='btn-cinza'>Saída</button>
                            </div>
                            <form onSubmit={typeModal ? handleSubmit : handleSubmitEdit}>
                                <label htmlFor='valor'>Valor</label>
                                <input
                                    id='valor'
                                    name='valor'
                                    type='number'
                                    value={forms.valor}
                                    onChange={(e) => handleChangeForm(e)}
                                />
                                <label htmlFor='categoria'>Categoria</label>
                                <select onChange={handleChangeCategory}>
                                    {categorias.map((categoria) => (
                                        <option name='categoria' value={categoria.id} key={categoria.id}>{categoria.descricao}</option>

                                    ))}
                                </select>
                                <label htmlFor='data'>Data</label>
                                <input
                                    id='data'
                                    name='data'
                                    type='date'
                                    value={forms.data}
                                    onChange={(e) => handleChangeForm(e)}
                                />
                                <label htmlFor='descricao'>Descrição</label>
                                <input
                                    id='descricao'
                                    name='descricao'
                                    type='text'
                                    value={forms.descricao}
                                    onChange={(e) => handleChangeForm(e)}
                                />
                                <button>Confirmar</button>
                            </form>
                        </div>
                    </div>}
                {modalEditUser &&
                    <div className='container-modal'>
                        <div className='modal-resumo'>
                            <div className='modal-exit'>
                                <h1>Editar Perfil</h1>
                                <img onClick={() => setModalEditUser(false)} src={ModalExit} alt='fechar' />
                            </div>

                            <form onSubmit={handleEditUser}>
                                <label >Nome</label>
                                <input
                                    name='usuario'
                                    type='text'
                                    value={formsUser.usuario}
                                    onChange={(e) => handleChangeForm(e)}
                                />

                                <label >E-mail</label>
                                <input
                                    name='email'
                                    type='email'
                                    value={forms.email}
                                    onChange={(e) => handleChangeForm(e)}
                                />
                                <label>Senha</label>
                                <input
                                    name='senha'
                                    type='password'
                                    value={forms.senha}
                                    onChange={(e) => handleChangeForm(e)}
                                />
                                <label>Confirmar Senha</label>
                                <input
                                    name='confirmacao'
                                    type='password'
                                    value={forms.confirmacao}
                                    onChange={(e) => handleChangeForm(e)}
                                />
                                <button>Confirmar</button>
                            </form>
                        </div>
                    </div>}
            </div>
        </div>
    )
}