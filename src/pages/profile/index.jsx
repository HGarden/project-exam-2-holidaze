import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ctx from '@/components/context.jsx';
import { getBookingsForProfile, updateProfile } from '@/api/profiles.js';

export default function Profile() {
	const navigate = useNavigate();
		const { auth, addToast } = useContext(ctx);
	const [bookings, setBookings] = useState([]);
	const [avatar, setAvatar] = useState(auth?.user?.avatar?.url || '');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
  const isManager = !!auth?.user?.venueManager;

	useEffect(() => {
		if (!auth?.token) {
			navigate('/login');
			return;
		}
			async function load() {
			setLoading(true);
			try {
					const name = auth.user?.name;
					const json = await getBookingsForProfile(name, { token: auth.token });
					setBookings(json.data || json);
			} catch (e) {
				setMessage(e.message);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [auth, navigate]);

		async function updateAvatar(e) {
		e.preventDefault();
		setMessage('');
		try {
				const name = auth.user?.name;
				const json = await updateProfile(name, { avatar: { url: avatar, alt: `${name}'s avatar` } }, { token: auth.token });
				auth.setUser({ ...auth.user, avatar: (json.data || json).avatar });
					setMessage('Avatar updated');
					addToast('Avatar updated', 'success');
		} catch (e) {
			setMessage(e.message);
					addToast(e.message, 'error');
		}
	}

		async function setManager(enabled) {
		setMessage('');
		try {
				const name = auth.user?.name;
				const json = await updateProfile(name, { venueManager: !!enabled }, { token: auth.token });
				const data = json.data || json;
				auth.setUser({ ...auth.user, venueManager: data.venueManager });
			setMessage(`Venue manager ${enabled ? 'enabled' : 'disabled'}`);
			addToast(`Venue manager ${enabled ? 'enabled' : 'disabled'}`, 'success');
		} catch (e) {
			setMessage(e.message);
			addToast(e.message, 'error');
		}
	}

		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-semibold">Profile</h1>
				<div className="card bg-base-100 shadow mt-4">
					<div className="card-body flex-row items-center gap-4">
						<img className="w-16 h-16 rounded-full object-cover" src={auth.user?.avatar?.url || 'https://placehold.co/64'} alt="avatar" />
						<form onSubmit={updateAvatar} className="join w-full max-w-xl">
							<input className="input input-bordered join-item w-full" placeholder="Avatar URL" value={avatar} onChange={(e)=>setAvatar(e.target.value)} />
							<button className="btn btn-secondary join-item" type="submit">Update avatar</button>
						</form>
					</div>
				</div>

					{/* Venue manager controls */}
					<div className="card bg-base-100 shadow mt-4">
						<div className="card-body">
							<div className="flex items-center justify-between gap-4 flex-wrap">
								<div>
									<h2 className="card-title">Venue manager</h2>
									<p className="opacity-80 text-sm">Enable this to create and manage venues.</p>
								</div>
								<div className="flex gap-2">
									{isManager ? (
										<>
											<Link className="btn btn-primary" to="/admin">Open admin</Link>
											<button className="btn" onClick={() => setManager(false)}>Disable</button>
										</>
									) : (
										<button className="btn btn-primary" onClick={() => setManager(true)}>Enable</button>
									)}
								</div>
							</div>
						</div>
					</div>
				{message && <div className="alert mt-3" role="status">{message}</div>}
				<h2 className="text-xl font-semibold mt-6">Upcoming bookings</h2>
				{loading && <p>Loading...</p>}
				<div className="grid gap-3 mt-2">
					{bookings.map((b) => (
						<div key={b.id} className="card bg-base-100 shadow">
							<div className="card-body">
								<div className="font-medium">{b.venue?.name}</div>
								<div className="text-sm opacity-80">{new Date(b.dateFrom).toDateString()} - {new Date(b.dateTo).toDateString()}</div>
							</div>
						</div>
					))}
					{bookings.length === 0 && !loading && <div className="alert">No upcoming bookings</div>}
				</div>
			</div>
		);
}
