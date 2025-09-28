import * as yup from 'yup';

const urlRegex = /^(https?:)\/\//i;

export const venueSchema = yup.object({
  name: yup.string().trim().min(2, 'Name is too short').max(120, 'Name is too long').required('Name is required'),
  description: yup.string().trim().max(2000, 'Description too long').default(''),
  image: yup.string().trim().nullable().transform(v => (v?.length ? v : null)).test({
    name: 'url',
    message: 'Image must be a valid http(s) URL',
    test: (v) => v == null || urlRegex.test(v)
  }),
  price: yup.number().transform(v => (isNaN(v) ? 0 : v)).min(0, 'Price can\'t be negative').max(100000, 'Price too high').required(),
  maxGuests: yup.number().transform(v => (isNaN(v) ? 1 : v)).min(1, 'At least 1 guest').max(100, 'Too many guests').required(),
  wifi: yup.boolean().default(false),
  parking: yup.boolean().default(false),
  breakfast: yup.boolean().default(false),
  pets: yup.boolean().default(false),
  address: yup.string().trim().nullable().transform(v => (v?.length ? v : null)),
  city: yup.string().trim().nullable().transform(v => (v?.length ? v : null)),
  zip: yup.string().trim().nullable().transform(v => (v?.length ? v : null)),
  country: yup.string().trim().nullable().transform(v => (v?.length ? v : null)),
});

export function toApiPayload(values) {
  const media = values.image ? [{ url: values.image, alt: values.name }] : [];
  const meta = { wifi: !!values.wifi, parking: !!values.parking, breakfast: !!values.breakfast, pets: !!values.pets };
  const location = { address: values.address ?? null, city: values.city ?? null, zip: values.zip ?? null, country: values.country ?? null };
  return { name: values.name, description: values.description || '', media, price: Number(values.price || 0), maxGuests: Number(values.maxGuests || 1), meta, location };
}
