import React, { useState, useEffect } from 'react';
import { getData } from '@/service/api';
import ReactPlayer from 'react-player'

function ShowreelSection() {

  const [url, setUrl] = useState([])

  const fetchUrl = async () => {
    try {
      const response = await getData("showreels/")
      console.log(response.data)
      setUrl(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération d'url : ", err)
    }
  }

  useEffect(() => {
    fetchUrl()
  }, [])

  const firstLink = url?.[0]?.link || null;

  return (
    <div className='relative w-full max-w-7xl mx-auto  py-15' id='showreel'>
      {firstLink ? (
        <div style={{ position: 'relative', paddingTop: '56.25%' /* Ratio 16:9 */ }}>
          <ReactPlayer
            src={firstLink}
            controls={true}
            width='100%'
            height='60%'
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
                      youtube: {
                          playerVars: { showinfo: 1 }
                      }
                  }}
          />
        </div>
      ) : (
        <p className='text-white'>Chargement...</p>
      )}
    </div>
  );
}

export default ShowreelSection;
