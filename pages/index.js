import {useTracking} from '../components/context/Tracking';
import {doTrack} from '../lib/analytics';

const Track = () => {
  const {canTrack, isGDPR, resetCanTrack} = useTracking();
  return (
      <div>
        <h1>Context Track</h1>
        <p>Is this a GDPR site? {isGDPR ? 'yes' : 'no'}</p>
        <p>Can track? {canTrack ? 'yes' : 'no'}</p>
        <button onClick={doTrack}>Track</button>
        <button onClick={() => resetCanTrack()}>Reset</button>
      </div>
  );
};

export default Track;
