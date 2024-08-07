import { useState } from 'react';
import image from '../../Assets/background/image.png';
import { Header } from '../../components/Header';
import ItemList from '../../components/ItemList';
import './style.css';

function App() {
    const [user, setUser] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [repos, setRepos] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetData = async () => {
        setLoading(true);
        setError(null);
        setCurrentUser(null);
        setRepos(null);

        try {
            const userData = await fetch(`https://api.github.com/users/${user}`);
            
            if (userData.status === 404) {
                setError('Usuário não encontrado');
                setLoading(false);
                return;
            }

            const newUser = await userData.json();

            const { avatar_url, name, bio } = newUser;
            setCurrentUser({ avatar_url, name, bio });

            const reposData = await fetch(`https://api.github.com/users/${user}/repos`);
            const newRepos = await reposData.json();

            setRepos(newRepos);
        } catch (err) {
            setError('Erro ao buscar dados');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <Header />
            <div className="conteudo">
                <img src={image} className="background" alt="background app" />
                <div className="info">
                    <div>
                        <input
                            name="usuario"
                            value={user}
                            onChange={event => setUser(event.target.value)}
                            placeholder="@username"
                        />
                        <button onClick={handleGetData} disabled={loading}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                    {error && <p className="error">{error}</p>}
                    {currentUser && (
                        <>
                            <div className="perfil">
                                <img
                                    src={currentUser.avatar_url}
                                    className="profile"
                                    alt="imagem de perfil"
                                />
                                <div>
                                    <h3>{currentUser.name}</h3>
                                    <span>@{user}</span>
                                    <p>{currentUser.bio}</p>
                                </div>
                            </div>
                            <hr />
                        </>
                    )}
                    {repos && (
                        <div>
                            <h4 className="repositorio">Repositórios</h4>
                            {repos.length > 0 ? (
                                repos.map(repo => (
                                    <ItemList
                                        key={repo.id}
                                        title={repo.name}
                                        description={repo.description || 'Sem descrição'}
                                    />
                                ))
                            ) : (
                                <p>Esse usuário não possui repositórios públicos.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
