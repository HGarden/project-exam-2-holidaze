import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ctx from './context.jsx';

export default function SearchForm({ autoFocus = false }) {
		const { input, setInput, setSearchResults, setPage } = useContext(ctx);
		const [local, setLocal] = useState(input || '');
		const [loading, setLoading] = useState(false);
		const [error, setError] = useState('');
        const navigate = useNavigate();

		// Keep local input in sync if external input changes (e.g., programmatic clears)
		useEffect(() => {
			setLocal(input || '');
		}, [input]);

		// Debounce propagation to global search state only
		const timerRef = useRef(null);
		function onChange(e) {
			const value = e.target.value;
			setLocal(value); // immediate for responsiveness
			setError('');

			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				setPage(1);
				setSearchResults([]);
				setInput(value);
			}, 200);
		}

		function handleSubmit(e) {
			e.preventDefault();
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			setLoading(true);
			setPage(1);
			setSearchResults([]);
			setInput(local);
			// Navigate to the Home/results page with the query so search works from any page
			const q = (local || '').trim();
			navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
			setLoading(false);
		}

		function clearSearch() {
			if (timerRef.current) clearTimeout(timerRef.current);
			setLocal('');
			setPage(1);
			setSearchResults([]);
			setInput('');
			setLoading(false);
		}

			// Cleanup timer on unmount
		useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

		return (
			<form onSubmit={handleSubmit} className="form-control">
							<div className="join w-full">
					<input
						value={local}
						onChange={onChange}
						type="text"
						placeholder="Search venues"
						className="input input-bordered join-item w-full md:w-64"
						autoFocus={autoFocus}
						aria-label="Search venues"
					/>
					{local && (
						<button
							type="button"
							aria-label="Clear search"
							className="btn join-item"
							onClick={clearSearch}
							title="Clear"
						>
							×
						</button>
					)}
					<button className="btn btn-secondary join-item" type="submit" disabled={loading}>
						{loading ? 'Searching…' : 'Search'}
					</button>
				</div>
				{error && <span className="text-error text-sm">{error}</span>}
			</form>
		);
	}

SearchForm.propTypes = {
	autoFocus: PropTypes.bool,
};
