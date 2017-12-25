import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    render() {

        return (
            <header>
                <ul>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/authors">Авторы</Link></li>
                    <li><Link to="/nouns">Существительные</Link></li>
                </ul>

            </header>
        );
    }
}


export default Header;
