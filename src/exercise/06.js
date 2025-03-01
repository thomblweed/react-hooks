// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundaryThom extends React.Component {
  state = {error: null}

  static getDerivedStateFromError(error) {
    return {error}
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack)
  }

  render() {
    const {error} = this.state
    const {children, fallback} = this.props
    if (error) {
      return fallback
    }
    return children
  }
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [state, setState] = React.useState({pokemon: null, status: 'idle'})
  const [error, setError] = React.useState({message: ''})
  const {pokemon, status} = state

  React.useEffect(() => {
    if (state.status === 'rejected') {
      throw new Error('shit happened')
    }
  }, [state.status])

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setError({message: ''})
    setState({pokemon: null, status: 'pending'})
    fetchPokemon(pokemonName)
      .then(response => {
        setState({pokemon: response, status: 'resolved'})
      })
      .catch(error => {
        setState({pokemon: null, status: 'rejected'})
        setError({message: error.message})
      })
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  return (
    <>
      {status === 'pending' ? <div>...{status}</div> : null}
      {pokemonName ? null : <div>Submit a pokemon</div>}
      {pokemonName && !pokemon ? (
        <PokemonInfoFallback name={pokemonName} />
      ) : null}
      {pokemon ? <PokemonDataView pokemon={pokemon} /> : null}
      {error.message ? (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      ) : null}
    </>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />

      <div className="pokemon-info">
        {/* When the key changes, the ErrorBoundary will be unmounted and remounted. */}
        <ErrorBoundary
          // key={pokemonName}
          FallbackComponent={({error, resetErrorBoundary}) => (
            <>
              <p>{error}</p>
              <button onClick={resetErrorBoundary}>try again</button>
            </>
          )}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
