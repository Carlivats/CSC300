const TrainArrivalList = ({ trains }) => {
  return (
    <div className="self-start">
      <h2 className="text-3xl underline font-semibold mb-2 text-white">
        Next Trains
      </h2>
      {trains.length > 0 ? (
        <ul className="pl-6 list-disc text-white text-2xl">
          {trains.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xl font-semibold text-white">
          No train data loaded.
        </p>
      )}
    </div>
  );
};

export default TrainArrivalList;