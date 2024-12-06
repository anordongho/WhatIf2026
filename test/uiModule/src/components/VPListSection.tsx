import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../redux/store/store";
import { Section, setSection } from "../redux/slice/section";
import { setVpList } from "../redux/slice/vpList";
import { setVPSelected } from "../redux/slice/vpSelected";

const VPListSection = () => {
  const myVPs = useSelector((state: RootState) => state.vpListReducer.vpList);
  const dispatch = useDispatch();

  //VP data load
  useEffect(() => {
    const vpList = localStorage.getItem('VPList');
    if (vpList) dispatch(setVpList(JSON.parse(vpList)));
  }, []);

  const handleUseVP = (vp: object) => {
    localStorage.setItem('VP', JSON.stringify(vp));
    dispatch(setSection(Section.VOTE));
    dispatch(setVPSelected());
  };

  const handleDeleteVP = (id: string) => {
    const updatedVPs = myVPs.filter(vp => vp.id !== id);
    dispatch(setVpList(updatedVPs));
    console.log('length:', myVPs.length);
    localStorage.setItem('VPList', JSON.stringify(updatedVPs));
    console.log('length after:', myVPs.length);
  };

  return (
    <>
      <h2 className="text-5xl font-bold mb-8  pt-16" style={{ color: '#ffa600' }}>내 VP 목록</h2>
      <div className="grid grid-cols-1 gap-4">
        {myVPs.map((vp) => (
          <div key={vp.id} className="bg-[#1f2937] rounded-xl p-6" style={{ fontFamily: '"Pretendard", "DM Serif Display", serif' }}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-4">
                  생성일: {new Date(vp.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[#ffa600] mb-3">포함된 정보:</p>
                <div className="flex flex-wrap gap-2">
                  {vp.selectedFields.map((field) => (
                    <span key={field}
                      className="bg-[#ffa600] text-black px-4 py-1 rounded-full text-sm font-sans"
                      style={{ minWidth: '80px', textAlign: 'center' }}
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 ml-4">
                <button
                  onClick={() => handleUseVP(vp.vp)}
                  className="bg-[#ffa600] text-white px-6 py-2 rounded-lg hover:bg-[#ff8800] transition-colors duration-300 font-sans"
                  style={{ width: '100px', height: '40px' }}
                >
                  USE
                </button>
                <button
                  onClick={() => handleDeleteVP(vp.id)}
                  className="bg-[#dc2626] text-white px-6 py-2 rounded-lg hover:bg-[#b91c1c] transition-colors duration-300 font-sans"
                  style={{ width: '100px', height: '40px' }}
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
};

export default VPListSection;