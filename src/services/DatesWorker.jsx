import { useEffect} from 'react';

const DatesWorker = (API_URL, token, setDatesWorker) => {

    useEffect(() => {
        const DatesWorker = async () => {
          const response = await fetch(`${API_URL}/workers`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const result = await response.json();
          setDatesWorker(result);
      
        };
        DatesWorker();
      },[API_URL, token, setDatesWorker ]);

}

export default DatesWorker
