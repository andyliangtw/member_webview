import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { Designer } from '../ReactDesigner';
import ShowTable from './ShowTable';
import AddBar from './AddBar';
import svgAPI from '../../APIs/svgAPI';
import templateAPI from '../../APIs/templateAPI';

import LANG from '../../languages/zh-tw.json';

import './style.css';

export default function TemplatePage() {
  const [datas, setDatas] = useState([]);
  const [svg, setSvg] = useState({ name: '', data: [] });
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(350);

  const head = {
    term_name: LANG.name,
    type: LANG.type,
    data: LANG.data,
  };
  const columns = ['term_name', 'type', 'data'];

  const setSvgName = (newName) => {
    const tmp = { ...svg };
    tmp.name = newName;
    setSvg(tmp);
  };
  const setSvgObjects = (newObjects) => {
    const tmp = { ...svg };
    tmp.data = newObjects;
    setSvg(tmp);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const svg_id = urlParams.get('id');

    if (svg_id) {
      // set initial svg data
      svgAPI.getSVG(svg_id).then((res) => {
        const tmp = res.data.data;
        const initialSvgDatas = {
          id: tmp.id,
          name: tmp.name,
          data: JSON.parse(tmp.svg),
        };
        setSvg(initialSvgDatas);
      });

      // setInitialDatas
      templateAPI.getRelatedTemplate(svg_id).then((res) => {
        setDatas(res.data.data);
      });
    }
  }, []);

  return (
    <>
      <div className="template_page_container">
        <div>
          <a href="/">{LANG.back}</a>
        </div>
        <div>
          <label>
            {LANG.name}:{' '}
            <input
              type="text"
              name="svg_name"
              value={svg.name}
              onChange={(e) => setSvgName(e.target.value)}></input>
          </label>
        </div>
        <div className="designer">
          <div className="canvas_settings">
            <label>
              {LANG.width}:{' '}
              <input
                type="number"
                name="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}></input>
            </label>
            <label>
              {LANG.height}:{' '}
              <input
                type="number"
                name="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}></input>
            </label>
          </div>
          <Designer
            width={width}
            height={height}
            objects={svg.data}
            onUpdate={(newObjects) => setSvgObjects(newObjects)}
          />
        </div>
        <br />
        <Button
          onClick={() => {
            if (svg.name) {
              if (svg.id) {
                saveSvg(svg.id, svg);
              } else {
                saveNewSvg(svg);
                window.location.replace('/');
              }
            } else {
              alert(LANG.please_enter_name);
            }
          }}>
          {LANG.save_svg}
        </Button>
      </div>
      {svg.id && (
        <>
          <AddBar svg_id={svg.id} setBody={setDatas} />
          <ShowTable
            head={head}
            columns={columns}
            datas={datas}
            setDatas={setDatas}
            deleteData={deleteData}
          />
          <Button
            onClick={() => {
              updateTemplate(datas);
            }}>
            {LANG.save_changes}
          </Button>
        </>
      )}
    </>
  );
}

const saveNewSvg = (newSVG) => {
  svgAPI
    .createSVG(newSVG)
    .then((res) => {})
    .catch((err) => {
      console.error(err);
    });
};

const saveSvg = (id, newSVG) => {
  svgAPI
    .editSVG(id, newSVG)
    .then((res) => {})
    .catch((err) => {
      console.error(err);
    });
};

const updateTemplate = (datas) => {
  Object.keys(datas).forEach((key) => {
    templateAPI
      .editTemplate(datas[key].id, datas[key])
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  });
};

const deleteData = (id) => {
  templateAPI
    .deleteTemplate(id)
    .then((res) => {})
    .catch((err) => {
      console.error(err);
    });
};
