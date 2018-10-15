import React, { Component } from 'react';
import PropTypes from 'prop-types';

function SelectLanguage({ activeLanguage, onSelect }) {
    const languages = ['All', 'Javascript', 'ABAP', 'Java', 'Ruby', 'Python'];

    return (
        <ul className='languages'>
            {languages.map((language) => (
                <li
                    key={language}
                    className={activeLanguage === language ? 'active' : 'inactive'}
                    onClick={onSelect.bind(this, language)}>
                    {language}
                </li>)
            )}
        </ul>
    )
}
SelectLanguage.propTypes = {
    activeLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}


export class Popular extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeLanguage: 'All'
        }

        // Make sure all state modifying functions access the proper THIS context
        this.updateLanguage = this.updateLanguage.bind(this);
    }

    updateLanguage(language) {
        this.setState({
            activeLanguage: language
        })
    }

    render() {
        return (
            <div>
                <SelectLanguage activeLanguage={this.state.activeLanguage} onSelect={this.updateLanguage} />
            </div>
        )
    }
}