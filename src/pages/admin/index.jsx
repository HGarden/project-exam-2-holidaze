import { useContext, useEffect, useState } from 'react';
import ctx from '@/components/context.jsx';
import { venueSchema, toApiPayload } from './validation.js';
// imports consolidated via API module
import { listMyVenues, createVenue as apiCreateVenue, updateVenue as apiUpdateVenue, deleteVenue as apiDeleteVenue, getVenueWithBookings } from '@/api/venues.js';

export default function Admin() {
		const { auth, addToast } = useContext(ctx);
	const [venues, setVenues] = useState([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [bookingsMap, setBookingsMap] = useState({});
	const [editOpen, setEditOpen] = useState(false);
	const [editingVenue, setEditingVenue] = useState(null);
	const [editSaving, setEditSaving] = useState(false);
	const isManager = !!auth?.user?.venueManager;

		useEffect(() => {
			fetchMyVenues();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [auth?.user?.name, auth?.token]);

		async function fetchMyVenues() {
			if (!auth?.user?.name) return;
			setLoading(true);
			try {
				const name = auth.user.name;
				const json = await listMyVenues(name, { token: auth?.token });
				setVenues(json.data || json);
			} finally {
				setLoading(false);
			}
		}

	async function createVenue(e) {
		e.preventDefault();
		const formEl = e.currentTarget;
		const form = new FormData(formEl);
		const values = {
			name: form.get('name'),
			description: form.get('description') || '',
			image: (form.get('image') || '').toString().trim(),
			price: Number(form.get('price') || 0),
			maxGuests: Number(form.get('maxGuests') || 1),
			wifi: !!form.get('wifi'),
			parking: !!form.get('parking'),
			breakfast: !!form.get('breakfast'),
			pets: !!form.get('pets'),
			address: (form.get('address') || '').toString().trim(),
			city: (form.get('city') || '').toString().trim(),
			zip: (form.get('zip') || '').toString().trim(),
			country: (form.get('country') || '').toString().trim(),
		};
		let payload;
		try {
			const validated = await venueSchema.validate(values, { abortEarly: false, stripUnknown: true });
			payload = toApiPayload(validated);
		} catch (err) {
			const msg = err?.errors?.join('\n') || 'Validation failed';
			setMessage(msg);
			addToast(msg, 'error');
			return;
		}
		try {
			setMessage('');
			await apiCreateVenue(payload, { token: auth.token });
			await fetchMyVenues();
			// React may null out e.currentTarget after await; use cached formEl
			formEl?.reset();
					setMessage('Venue created');
					addToast('Venue created', 'success');
		} catch (e) {
			setMessage(e.message);
					addToast(e.message, 'error');
		}
	}

	function openEdit(v) {
		setEditingVenue({
			id: v.id,
			name: v.name || '',
			description: v.description || '',
			image: v.media?.[0]?.url || '',
			price: typeof v.price === 'number' ? v.price : Number(v.price || 0),
			maxGuests: typeof v.maxGuests === 'number' ? v.maxGuests : Number(v.maxGuests || 1),
			wifi: !!v.meta?.wifi,
			parking: !!v.meta?.parking,
			breakfast: !!v.meta?.breakfast,
			pets: !!v.meta?.pets,
			address: v.location?.address || '',
			city: v.location?.city || '',
			zip: v.location?.zip || '',
			country: v.location?.country || '',
		});
		setEditOpen(true);
	}

	function closeEdit() {
		setEditOpen(false);
		setEditingVenue(null);
	}

	async function submitEdit(e) {
		e.preventDefault();
		if (!editingVenue) return;
		let payload;
		try {
			const validated = await venueSchema.validate(editingVenue, { abortEarly: false, stripUnknown: true });
			payload = toApiPayload(validated);
		} catch (err) {
			const msg = err?.errors?.join('\n') || 'Validation failed';
			setMessage(msg);
			addToast(msg, 'error');
			return;
		}
		try {
			setEditSaving(true);
			await apiUpdateVenue(editingVenue.id, payload, { token: auth.token });
			await fetchMyVenues();
			addToast('Venue updated', 'success');
			closeEdit();
		} catch (e) {
			setMessage(e.message);
			addToast(e.message, 'error');
		} finally {
			setEditSaving(false);
		}
	}

	async function deleteVenue(id) {
		if (!confirm('Delete this venue?')) return;
		try {
			await apiDeleteVenue(id, { token: auth.token });
			await fetchMyVenues();
					addToast('Venue deleted', 'success');
		} catch (e) {
					setMessage(e.message);
					addToast(e.message, 'error');
		}
	}

	async function loadBookings(id) {
		try {
			const json = await getVenueWithBookings(id, { token: auth.token });
			const data = json.data || json;
			setBookingsMap(m => ({ ...m, [id]: data.bookings || [] }));
		} catch (e) {
			setMessage(e.message);
		}
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-semibold">Manage Venues</h1>
			{!isManager && <div className="alert alert-warning mt-3">You are not a venue manager.</div>}
				{isManager && (
						<div className="card bg-base-100 shadow mt-4">
							<div className="card-body">
								<h2 className="card-title">Create a venue</h2>
								<form onSubmit={createVenue} className="grid gap-2 grid-cols-1 md:grid-cols-2">
									<input className="input input-bordered" name="name" placeholder="Name" required />
									<input className="input input-bordered" name="image" placeholder="Image URL" />
									<input className="input input-bordered" name="price" placeholder="Price" type="number" />
									<input className="input input-bordered" name="maxGuests" placeholder="Max guests" type="number" />
									<input className="input input-bordered" name="address" placeholder="Address (optional)" />
									<input className="input input-bordered" name="city" placeholder="City (optional)" />
									<input className="input input-bordered" name="zip" placeholder="ZIP (optional)" />
									<input className="input input-bordered" name="country" placeholder="Country (optional)" />
									<textarea className="textarea textarea-bordered md:col-span-2" name="description" placeholder="Description" />
									<div className="md:col-span-2 flex gap-4">
										<label className="label cursor-pointer gap-2"><input type="checkbox" name="wifi" className="checkbox"/>Wifi</label>
										<label className="label cursor-pointer gap-2"><input type="checkbox" name="parking" className="checkbox"/>Parking</label>
										<label className="label cursor-pointer gap-2"><input type="checkbox" name="breakfast" className="checkbox"/>Breakfast</label>
										<label className="label cursor-pointer gap-2"><input type="checkbox" name="pets" className="checkbox"/>Pets</label>
									</div>
									<button className="btn btn-primary md:col-span-2" type="submit">Create venue</button>
								</form>
							</div>
						</div>
					)}
			{message && <div className="mt-2 text-sm">{message}</div>}
			<h2 className="text-xl font-semibold mt-6">Your venues</h2>
			{loading && <p>Loading...</p>}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-3">
				{venues.map(v => (
					<div key={v.id} className="card bg-base-100 shadow">
						{v.media?.[0]?.url && <img src={v.media[0].url} alt={v.name} className="rounded-t-box h-40 w-full object-cover"/>}
						<div className="card-body">
							<div className="font-semibold">{v.name}</div>
							<div className="card-actions justify-end">
								<button className="btn btn-sm" onClick={() => openEdit(v)}>Edit</button>
								<button className="btn btn-sm btn-error" onClick={() => deleteVenue(v.id)}>Delete</button>
												<button className="btn btn-sm" onClick={() => loadBookings(v.id)}>View bookings</button>
							</div>
											{bookingsMap[v.id] && (
												<div className="mt-3 text-sm">
													<div className="font-medium">Bookings</div>
													<ul className="list-disc list-inside">
														{bookingsMap[v.id].map(b => (
															<li key={b.id}>{new Date(b.dateFrom).toDateString()} - {new Date(b.dateTo).toDateString()} ({b.guests} guests)</li>
														))}
														{bookingsMap[v.id].length === 0 && <li>No bookings</li>}
												</ul>
											</div>
										)}
						</div>
					</div>
				))}
			</div>
			{editOpen && editingVenue && (
				<div className="modal modal-open" role="dialog">
					<div className="modal-box max-w-3xl">
						<h3 className="font-bold text-lg">Edit venue</h3>
						<form className="grid gap-2 grid-cols-1 md:grid-cols-2 mt-3" onSubmit={submitEdit}>
							<label className="form-control">
								<span className="label-text">Name</span>
								<input className="input input-bordered" value={editingVenue.name} onChange={e => setEditingVenue(s => ({ ...s, name: e.target.value }))} required />
							</label>
							<label className="form-control">
								<span className="label-text">Image URL</span>
								<input className="input input-bordered" value={editingVenue.image} onChange={e => setEditingVenue(s => ({ ...s, image: e.target.value }))} />
							</label>
							<label className="form-control">
								<span className="label-text">Price</span>
								<input type="number" className="input input-bordered" value={editingVenue.price} onChange={e => setEditingVenue(s => ({ ...s, price: e.target.value }))} />
							</label>
							<label className="form-control">
								<span className="label-text">Max guests</span>
								<input type="number" className="input input-bordered" value={editingVenue.maxGuests} onChange={e => setEditingVenue(s => ({ ...s, maxGuests: e.target.value }))} />
							</label>
							<label className="form-control md:col-span-2">
								<span className="label-text">Description</span>
								<textarea className="textarea textarea-bordered" value={editingVenue.description} onChange={e => setEditingVenue(s => ({ ...s, description: e.target.value }))} />
							</label>
							<label className="form-control">
								<span className="label-text">Address (optional)</span>
								<input className="input input-bordered" value={editingVenue.address} onChange={e => setEditingVenue(s => ({ ...s, address: e.target.value }))} />
							</label>
							<label className="form-control">
								<span className="label-text">City (optional)</span>
								<input className="input input-bordered" value={editingVenue.city} onChange={e => setEditingVenue(s => ({ ...s, city: e.target.value }))} />
							</label>
							<label className="form-control">
								<span className="label-text">ZIP (optional)</span>
								<input className="input input-bordered" value={editingVenue.zip} onChange={e => setEditingVenue(s => ({ ...s, zip: e.target.value }))} />
							</label>
							<label className="form-control">
								<span className="label-text">Country (optional)</span>
								<input className="input input-bordered" value={editingVenue.country} onChange={e => setEditingVenue(s => ({ ...s, country: e.target.value }))} />
							</label>
							<div className="md:col-span-2 flex flex-wrap gap-4 mt-2">
								<label className="label cursor-pointer gap-2"><input type="checkbox" className="checkbox" checked={!!editingVenue.wifi} onChange={e => setEditingVenue(s => ({ ...s, wifi: e.target.checked }))}/>Wifi</label>
								<label className="label cursor-pointer gap-2"><input type="checkbox" className="checkbox" checked={!!editingVenue.parking} onChange={e => setEditingVenue(s => ({ ...s, parking: e.target.checked }))}/>Parking</label>
								<label className="label cursor-pointer gap-2"><input type="checkbox" className="checkbox" checked={!!editingVenue.breakfast} onChange={e => setEditingVenue(s => ({ ...s, breakfast: e.target.checked }))}/>Breakfast</label>
								<label className="label cursor-pointer gap-2"><input type="checkbox" className="checkbox" checked={!!editingVenue.pets} onChange={e => setEditingVenue(s => ({ ...s, pets: e.target.checked }))}/>Pets</label>
							</div>
							<div className="modal-action md:col-span-2">
								<button type="button" className="btn" onClick={closeEdit} disabled={editSaving}>Cancel</button>
								<button type="submit" className={`btn btn-primary ${editSaving ? 'loading' : ''}`} disabled={editSaving}>{editSaving ? 'Saving' : 'Save changes'}</button>
							</div>
						</form>
					</div>
					<button className="modal-backdrop" onClick={closeEdit}>close</button>
				</div>
			)}
		</div>
	);
}
