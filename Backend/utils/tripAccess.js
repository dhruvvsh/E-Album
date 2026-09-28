// True when `userId` is one of the trip's participants (works for populated or raw ids)
export const isParticipant = (trip, userId) =>
  trip.participants.some(
    (p) => (p._id || p).toString() === userId.toString()
  );
