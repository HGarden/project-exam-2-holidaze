import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ctx from '@/components/context.jsx';
import Rating from '@/components/Rating.jsx';
import Carousel from '@/components/Carousel.jsx';
import { getVenue, createBooking } from '@/api/bookings.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Venue() {

	const { id } = useParams();
	const navigate = useNavigate();
	const { auth, addToast } = useContext(ctx);
	const [venue, setVenue] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [bookings, setBookings] = useState([]);
	const [dateRange, setDateRange] = useState([null, null]);
	const [startDate, endDate] = dateRange;
	const [creating, setCreating] = useState(false);
	const [guests, setGuests] = useState(1);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				const json = await getVenue(id, { token: auth?.token });
				const data = json.data || json;
				setVenue(data);
				setBookings(data?.bookings || []);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [id, auth]);

	const bookedRanges = useMemo(
		() => bookings.map((b) => ({ start: new Date(b.dateFrom), end: new Date(b.dateTo) })),
		[bookings]
	);

	// bookedRanges used to present unavailable dates and can extend to a calendar component later

	async function submitBooking(e) {
		e.preventDefault();
		if (!auth?.token) {
			navigate('/login');
			return;
		}
		if (!startDate || !endDate) return;
		setCreating(true);
		try {
			const payload = {
				dateFrom: new Date(startDate).toISOString(),
				dateTo: new Date(endDate).toISOString(),
				guests: Number(guests) || 1,
				venueId: id,
			};
			await createBooking(payload, { token: auth.token });
			addToast('Booking created', 'success');
			navigate('/profile');
		} catch (e) {
			setError(e.message);
			addToast(e.message, 'error');
		} finally {
			setCreating(false);
		}
	}

	if (loading) return <div className="p-4">Loading...</div>;
	if (error)
		return (
			<div className="p-4 alert alert-error" role="alert">
				{error}
			</div>
		);
	if (!venue) return null;

	return (
		<div className="container mx-auto p-4 grid gap-6 md:grid-cols-2">
			<div>
				<Carousel images={venue.media} className="mb-2" />
				<h1 className="text-3xl font-semibold mt-2">{venue.name}</h1>
				{typeof venue.rating === 'number' && (
					<div className="flex items-center gap-2 mt-1">
						<Rating value={venue.rating} />
						<span className="text-sm opacity-80">{venue.rating.toFixed(1)}</span>
					</div>
				)}
				{typeof venue.price === 'number' && (
					<p className="mt-2 text-lg">
						<span className="font-semibold">${venue.price}</span> <span className="opacity-80">per night</span>
					</p>
				)}
				{venue.location?.city && (
					<p className="opacity-70">
						{venue.location.city}, {venue.location.country}
					</p>
				)}
				<p className="mt-2 whitespace-pre-wrap leading-relaxed">{venue.description}</p>
			</div>

			<div className="md:sticky md:top-24 h-fit">
				<div className="card bg-base-100 shadow">
					<div className="card-body">
						<h2 className="text-xl font-semibold">Book this venue</h2>
						<form onSubmit={submitBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
							<label className="form-control w-full col-span-1 md:col-span-1 min-w-0">
								<div className="label">
									<span className="label-text">Dates</span>
								</div>
								<DatePicker
									selected={startDate}
									startDate={startDate}
									endDate={endDate}
									onChange={(update) => {
										// update is [start, end]
										setDateRange(update);
									}}
									selectsRange
									minDate={new Date()}
									excludeDateIntervals={bookedRanges}
									placeholderText="Select date range"
									className="input input-bordered w-full max-w-full min-w-0 h-12 !pr-10"
									wrapperClassName="w-full min-w-0 block"
									calendarClassName="bg-base-100 text-base-content shadow-lg rounded-box"
								/>
							</label>

							<label className="form-control w-full col-span-1 md:col-span-1 min-w-0">
								<div className="label">
									<span className="label-text">Guests</span>
								</div>
								<input
									type="number"
									className="input input-bordered w-full h-12"
									value={guests}
									min={1}
									max={venue?.maxGuests || 10}
									onChange={(e) => setGuests(e.target.value)}
								/>
							</label>

							<button className="btn btn-primary md:col-span-2" disabled={creating}>
								{creating ? 'Creating booking...' : 'Book now'}
							</button>
						</form>

						<div className="mt-6">
							<h3 className="font-semibold mb-2">Availability (next 30 days)</h3>
							<div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 text-xs sm:text-sm">
								{Array.from({ length: 30 }).map((_, i) => {
									const d = new Date();
									d.setDate(d.getDate() + i);
									const isBooked = bookedRanges.some((r) => d >= r.start && d <= r.end);
									const full = d.toLocaleDateString();
									const dayOnly = String(d.getDate());
									return (
										<div
											key={i}
											className={`badge ${isBooked ? 'badge-error' : 'badge-success'} w-full h-9 sm:h-10 justify-center px-2 min-w-0 overflow-hidden`}
											title={full}
										>
											<span className="block w-full text-center">{dayOnly}</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
