import React, { useEffect, useState } from "react";
import { Table, Row, Pagination, Tag, Image, Input, Select, Modal, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemons, fetchPokemonsByType, fetchTypes, searchPokemonByName } from "./service/pokemonsService";
import { changeLimit, changePage, selectedPokemon } from "./features/pokemonsSlice";


const TableFooter: React.FC<any> = ({ paginationProps, }) => {
  return (
    <Row justify='space-between'>
      <Pagination {...paginationProps} />
    </Row>
  );
};


const AntTable: React.FC<any> = (

) => {
  const dispath = useDispatch()

  const { count, results, currentPage, offset, limit, loading, types, selected } = useSelector((state: any) => state.pokemons)

  const [isSearchMod, setIsSeacrhMod] = useState(false)
  const FilterByNameInput = (
    <>
      <h3>Name</h3>
      <Input
        placeholder="Search Name"
        onChange={e => {
          const currValue = e.target.value;
          if (currValue) {
            setIsSeacrhMod(true)
            //@ts-ignore
            dispath(searchPokemonByName(currValue))
          }
          else {
            setIsSeacrhMod(false)
          }

        }}
      />
    </>

  );


  const onChange = (value: string) => {
    console.log(value);
    if (value.length) {
      const id = value[value.length - 1][value[0].length - 2]
      setIsSeacrhMod(true)
      //@ts-ignore
      dispath(fetchPokemonsByType(id))
    }
    else {
      setIsSeacrhMod(false)
    }
  };
  const tagRender = (props: any) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={"geekblue"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  const FilterByTagsInput = (
    <>
      <h3>Tags</h3>
      <Select
        showArrow
        mode="multiple"
        placeholder="Select a type"
        onChange={onChange}
        style={{ width: '100%' }}
        options={types}
        tagRender={tagRender}

      />

    </>

  );
  useEffect(() => {
    if (!isSearchMod) {
      //@ts-ignore
      dispath(fetchPokemons({ offset, limit }))
    }
  }, [currentPage, limit, isSearchMod])
  useEffect(() => {
    //@ts-ignore
    dispath(fetchTypes())

  }, [])

  const columns = [
    {
      title: FilterByNameInput,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: FilterByTagsInput,
      key: 'info.types',
      dataIndex: 'info.types',
      render: (_: any, { info: { types } }: any) => {
        return <>
          {types.map((type: any) => {
            const typeName = type.type.name
            let color = typeName.length > 5 ? 'geekblue' : 'green';
            if (typeName === 'fire') {
              color = 'volcano';
            }
            return <Tag color={color} key={typeName}>{typeName}</Tag>
          })}
        </>

      },
    },
    {
      title: 'Avatar',
      key: 'info.sprites',
      dataIndex: 'info.sprites',
      render: (_: any, { info: { sprites } }: any) => {
        return <Image
          src={sprites.back_default}
        />
      },
    }

  ];
  const pagination = {
    pageSizeOptions: [10, 20, 50],
    current: currentPage,
    total: count,
    defaultCurrent: 1,
    pageSize: limit,
    hideOnSinglePage: true,
    onChange: (page: number,) => {
      dispath(changePage(page))
    },
    showSizeChanger: true,
    onShowSizeChange: (current: number, pageSize: number) => {
      console.log(current, pageSize);
      dispath(changeLimit(pageSize))

    },
    locale: {
      jump_to: "выбрать",
      page: "страницу",
    },
    showQuickJumper: 1 > 1000,
  };
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {selected && <>  <p>Name: {selected.name}</p>
          <div>
            How looks: <Image src={selected.info.sprites.back_default} />
          </div>
          <div>

            Abilities: {selected.info.abilities.map((a: any) => <p key={a?.ability?.name}>{a?.ability?.name}</p>)}
          </div>
        </>}

      </Modal>
      <Table
        loading={loading}
        onRow={(record,) => {
          return {
            onClick: () => {
              setIsModalOpen(true);
              console.log(record);
              dispath(selectedPokemon(record))
            },
          };
        }}
        rowKey={(record) => {
          return record.url || record.name;
        }}
        bordered
        columns={columns}
        dataSource={isSearchMod ? results.slice((currentPage - 1) * limit, limit * currentPage) : results}
        pagination={false}
        footer={() => <TableFooter paginationProps={pagination} />}
      /></>

  );
};

export default AntTable;
