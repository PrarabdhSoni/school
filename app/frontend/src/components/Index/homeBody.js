import { useNavigate } from 'react-router-dom';

const HomeBody = () => {
    const navigate = useNavigate();
    function Handler(){
        navigate('/signup');
    }
    return(
    <div className='container'>
        <h1>
            <span style={{color: '#8c52ff'}}>K</span>eep
            <span style={{color: '#FFCC00'}}>M</span>ee🥹 
            <span style={{color: '#545454'}}>  One</span>
        </h1>
        <h2>
            Focus on what matters, we’ll handle rest
        </h2>
        <button className='homebutton' type='submit' onClick={Handler} style={{backgroundColor: '#8c52ff', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '10px', paddingRight: '10px'}}>Sign Up</button>
        <div className='features'>
            <div className='todo'>
                <img src='todo.png' style={{height: '70px',}}alt=''/>
                <b><p>To Do</p></b>
            </div>
            <div className='notes'>
                <img src='notebook.png' style={{height: '70px',}}alt=''/>
                <b><p>Notes</p></b>
            </div>
            <div className='diary'>
                <img src='diary.png' style={{height: '70px',}}alt=''/>
                <b><p>Diary</p></b>
            </div>
        </div>
        <div>
            <hr></hr>
        </div>
    </div>
    )
};

export default HomeBody;