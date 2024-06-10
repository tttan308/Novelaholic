import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fetchHotNovels } from "../services/novel";
import { Link } from "react-router-dom";

const HotNovels = () => {
    const [hotNovels, setHotNovels] = useState([]);
    const [page, setPage] = useState(1);
    const [offset, setOffset] = useState(10);
    const [total, setTotal] = useState(1);

    useEffect(() => {
        const getData = async () => {
            const { data, total } = await fetchHotNovels(page);
            setHotNovels([...hotNovels, ...data]);
            setTotal(total);
        };
        getData();
    }, [page]);

    const handleViewMore = () => {
        setOffset(offset + 20);
        if (hotNovels.length < offset + 20) {
            setPage(page + 1);
        }
    };

    const novels = hotNovels.slice(0, offset);

    const showViewMore =
        page < total || (page === total && offset < hotNovels.length);

    return (
        <div className="p-6 my-4">
            <h2 className="text-[24px] font-bold border-b-4 border-main w-fit pr-6 pb-2">
                Truyện hot
            </h2>
            <div className="grid grid-cols-5 justify-between mx-14 my-6">
                {novels.map((novel) => (
                    <div key={novel.id} className="flex justify-center">
                        <Link
                            to={`/book/${novel.id}`}
                            className="flex flex-col items-center gap-2 max-w-[140px] my-3 cursor-pointer"
                        >
                            <img
                                src={novel.cover}
                                alt={novel.title}
                                className="w-36 h-48 object-cover"
                            />
                            <h3 className="text-[17px] font-bold text-center leading-relaxed">
                                {novel.title}
                            </h3>
                        </Link>
                    </div>
                ))}
            </div>
            {showViewMore && (
                <div
                    className="flex items-center justify-center gap-4 cursor-pointer"
                    onClick={handleViewMore}
                >
                    <div className="w-8 h-8 rounded-full bg-main flex justify-center items-center">
                        <FaChevronDown size={22} color="#ffffff" />
                    </div>
                    <span className="font-bold text-sub text-[18px]">
                        Xem thêm
                    </span>
                </div>
            )}
        </div>
    );
};

export default HotNovels;
