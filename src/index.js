import React, { useState, useEffect } from 'react'
import Axios from 'axios'

import { createRoot } from 'react-dom/client'

import CreateNewForm from './components/CreateNewForm'
import AnimalCard from './components/AnimalCard'

const App = () => {
	/* const animals = [
		{ name: 'Meawsalot', species: 'cat' },
		{ name: 'Barksalot', species: 'dog' }
	] */

	const [animals, setAnimals] = useState([])

	useEffect(() => {
		const fetchAnimals = async () => {
			const response = await Axios.get('/api/animals')
			setAnimals(response.data)
		}

		fetchAnimals()
	}, [])

	return (
		<div className='container'>
			<p>
				<a href='/'>&laquo; Back to public home page</a>
			</p>
			<CreateNewForm setAnimals={setAnimals} />
			<div className='animal-grid'>
				{animals.map(animal => (
					<AnimalCard key={animal._id} name={animal.name} species={animal.species} photo={animal._id} id={animal._id} setAnimals={setAnimals} />
				))}
			</div>
		</div>
	)
}

const root = createRoot(document.querySelector('#app'))
root.render(<App />)
