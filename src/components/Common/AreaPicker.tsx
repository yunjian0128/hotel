import React from "react";
import { Popup, PickerView, Button } from "antd-mobile";
import {
    PickerColumnItem,
    PickerValue,
} from "antd-mobile/es/components/picker-view";
import classNames from "classnames";
import { areaList } from "@vant/area-data";
import "./AreaPicker.css";

interface AreaPickerProps {
    visible: boolean; // picker是否显示
    className?: string;
    onClose: () => void; // picker内部点击关闭或遮罩时
    onConfirm?: (val: PickerValue[], name: any[]) => void;
}

const AreaPicker: React.FC<AreaPickerProps> = (props) => {
    const { visible, className, onClose, onConfirm } = props;
    const { province_list, city_list, county_list } = areaList; // 省市区

    // 变化的值（change）
    const [value, setValue] = React.useState<PickerValue[]>(["", "", ""]);
    // 确定的值（confirm 点击确定按钮后记录）
    const determinantVal = React.useRef<PickerValue[]>(["", "", ""]);

    const [provinceList, setProvinceList] = React.useState<PickerColumnItem[]>(
        []
    );
    const [cityList, setCityList] = React.useState<PickerColumnItem[]>([]);
    const [countyList, setCountyList] = React.useState<PickerColumnItem[]>([]);

    const classes = classNames("area-picker-popup", className);

    // 处理地区数据
    const processAreaData = (source: any): PickerColumnItem[] => {
        return [
            { label: "请选择", value: "" },
            ...Object.keys(source).map((key) => ({
                label: source[key],
                value: key,
            })),
        ];
    };

    // 根据传入的值设置城市和区县列表
    const updateCityAndCountyList = (currentVal: PickerValue[]) => {
        const [provinceVal, cityVal] = currentVal;
        const cityList = JSON.parse(JSON.stringify(city_list)); // 浅拷贝
        const countyList = JSON.parse(JSON.stringify(county_list));

        if (provinceVal) {
            const _pattern = new RegExp(
                `^${provinceVal.toString().slice(0, 2)}`
            );
            for (const k in cityList) {
                if (!_pattern.test(k)) {
                    delete cityList[k];
                }
            }
            setCityList(processAreaData(cityList));
        } else {
            setCityList([]);
        }

        if (cityVal) {
            const _pattern = new RegExp(`^${cityVal.toString().slice(0, 4)}`);
            for (const k in countyList) {
                if (!_pattern.test(k)) {
                    delete countyList[k];
                }
            }
            setCountyList(processAreaData(countyList));
        } else {
            setCountyList([]);
        }
    };

    // 点击确定按钮
    const handleConfirm = () => {
        determinantVal.current = [...value];
        onClose();

        var [Pcode, Ccode, Dcode] = value;
        if (!Pcode) Pcode = "";
        if (!Ccode) Ccode = "";
        if (!Dcode) Dcode = "";

        // console.log(Pcode, Ccode, Dcode)
        var list = [province_list[Pcode], city_list[Ccode], county_list[Dcode]];

        onConfirm && onConfirm([...value], list);
    };

    // 滑动选择时，根据省筛选市 根据市筛选区县
    const handleChange = (val: PickerValue[]) => {
        updateCityAndCountyList(val);
        setValue(val);
    };

    // mounted时设置省列表
    React.useEffect(() => {
        setProvinceList(processAreaData(province_list));
    }, []);

    // 当弹框显示时设置上次点确定时的值和列表
    React.useEffect(() => {
        if (visible) {
            updateCityAndCountyList(determinantVal.current);
            setValue(determinantVal.current);
        }
    }, [visible]);

    return (
        <Popup className={classes} visible={visible} onMaskClick={onClose}>
            <div className="popup-hd fx fx-hb fx-vc">
                <Button fill="none" onClick={onClose}>
                    取消
                </Button>
                <Button color="primary" fill="none" onClick={handleConfirm}>
                    确定
                </Button>
            </div>
            <div className="popup-bd">
                <PickerView
                    columns={[provinceList, cityList, countyList]}
                    value={value}
                    onChange={(val) => handleChange(val)}
                />
            </div>
        </Popup>
    );
};

export default AreaPicker;
