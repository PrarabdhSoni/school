import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    function Handler(){
        navigate('/signup');
    }
    function HandlerI(){
        navigate('/login')
    }
    return(
        <div>
            <nav className='navbar'>
            <h1 className='heading' ><span style={{color: '#8c52ff'}}>K</span>eep<span style={{color: '#FFCC00'}}>M</span>ee🥹</h1>
            <div>
                <button className='homebutton' type='submit' onClick={Handler} style={{backgroundColor: '#8c52ff'}}>Sign Up</button>
                <button className='homebutton' type='submit' onClick={HandlerI} style={{backgroundColor: '#FFCC00'}}>Sign In</button>
            </div>
            </nav>
            <hr></hr>
        </div>
    )
}

export default Header;
