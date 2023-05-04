import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useState, useCallback, useMemo, ChangeEvent, useEffect, FormEvent } from 'react'
import { getRange } from '../utils/getRange'
import {
  AvailableGroupTypes,
  fieldTypeOptions,
  getTypeBySubtype,
  IRowDatas,
} from '../utils/fieldTypeOptions'
import { generateFateDates } from '../utils/generateFateDates'
import { FaPlus } from 'react-icons/fa'
import { BsXLg } from 'react-icons/bs'
import classNames from 'classnames'
import {
  Card,
  Input,
  IconButton,
  Button,
  Select as Select,
  SelectOption,
} from 'hikari-ui'

const ReactJson = dynamic(() => import('react-json-view'), {
  ssr: false,
})

interface IChangeFieldNameValue {
  index: number
  value: string
}

interface IChangeFieldTypeValue {
  index: number
  e: ChangeEvent<HTMLSelectElement>
}

const initialRowsDatas: IRowDatas[] = [
  {
    fieldName: 'id',
    fieldType: 'uuid',
    groupType: 'datatype',
  },
  {
    fieldName: 'user-name',
    fieldType: 'findName',
    groupType: 'name',
  },
  {
    fieldName: 'avatar',
    fieldType: 'avatar',
    groupType: 'image',
  },
  {
    fieldName: 'gender',
    fieldType: 'gender',
    groupType: 'name',
  },
  {
    fieldName: 'phone-number',
    fieldType: 'phoneNumber',
    groupType: 'phone',
  },
  {
    fieldName: 'zip-code',
    fieldType: 'zipCode',
    groupType: 'address',
  },
  {
    fieldName: 'birth-date',
    fieldType: 'past',
    groupType: 'date',
  },
  // { fieldName: 'Sobre nome', fieldType: 'Last Name', groupType: 'name' },
]

const Home: NextPage = () => {
  const [rowDatas, setRowDatas] = useState<IRowDatas[]>(initialRowsDatas)
  const [numberRowToGanerate, setNumberRowToGanerate] = useState('10')
  const [generedfakeDatas, setGeneredfakeDatas] = useState<any[]>([])

  const [isGeneringFakeDatas, setIsGeneringFakeDatas] = useState(false)

  const selectOptions = useMemo<SelectOption[]>(() => {
    return fieldTypeOptions.map((fieldTypeOption) => ({
      label: fieldTypeOption.type,
      options: fieldTypeOption.subtypes.map((subtype) => ({
        label: subtype,
        value: subtype,
      })),
    }))
  }, [])

  const handleChangeFieldName = useCallback(({ index, value }: IChangeFieldNameValue) => {
    setRowDatas(([...currentRowDatas]) => {
      currentRowDatas[index].fieldName = value
      return currentRowDatas
    })
  }, [])

  const handleChangeFieldType = useCallback(({ index, e }: IChangeFieldTypeValue) => {
    setRowDatas(([...currentRowDatas]) => {
      const indexElement = e.target.selectedIndex
      const option = e.target.options[indexElement]
      const optgroup = option.parentElement
      const groupType = optgroup?.getAttribute('label')
      currentRowDatas[index].fieldType = e.target.value
      currentRowDatas[index].groupType = groupType as AvailableGroupTypes
      return currentRowDatas
    })
  }, [])

  const handleChangeFieldTypeHicari = useCallback(
    ({ index, value }: { index: number; value: string }) => {
      setRowDatas(([...currentRowDatas]) => {
        currentRowDatas[index].fieldType = value
        currentRowDatas[index].groupType = getTypeBySubtype(value)
        return currentRowDatas
      })
    },
    []
  )

  const handleAddRow = useCallback(() => {
    setRowDatas(([...currentRowDatas]) => {
      const lastRowDate = currentRowDatas[currentRowDatas.length - 1]
      currentRowDatas.push({ ...lastRowDate })
      return currentRowDatas
    })
  }, [])

  const handleRemoveRowByIndex = useCallback((index: number) => {
    setRowDatas(([...currentRowDatas]) => {
      currentRowDatas.splice(index, 1)
      return currentRowDatas
    })
  }, [])

  const handleGenerateFakeDatas = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        setIsGeneringFakeDatas(true)
        const response = await generateFateDates({
          fields: rowDatas,
          numRows: Number(numberRowToGanerate),
        })
        setGeneredfakeDatas(response)
      } catch (err) {
        console.log('err', err)
      }
    },
    [rowDatas, numberRowToGanerate]
  )

  useEffect(() => {
    setIsGeneringFakeDatas(false)
  }, [generedfakeDatas])

  const rowDataListElement = useMemo(() => {
    return getRange(rowDatas.length).map((_, i) => {
      const isFirstIndex = i === 0
      return (
        <div className="flex items-center space-x-2" key={i + 'row'}>
          <Input
            className="max-w-[240px] w-full"
            value={rowDatas[i].fieldName}
            required
            onChange={(e) => handleChangeFieldName({ index: i, value: e.target.value })}
            autoFocus
          />
          {/* <FormGroup className="max-w-[240px] w-full">
            <Select
              value={rowDatas[i].fieldType}
              onChange={(e) => handleChangeFieldType({ index: i, e })}
              required
            >
              {selectOptions}
            </Select>
          </FormGroup> */}
          <Select
            className="max-w-[240px] w-full"
            value={{ value: rowDatas[i].fieldType, label: rowDatas[i].fieldType }}
            isAutocomplite
            options={selectOptions}
            onChangeSingleOption={(newOptions) =>
              handleChangeFieldTypeHicari({ index: i, value: newOptions.value })
            }
          />
          {!isFirstIndex && (
            <IconButton
              variantStyle="danger"
              icon={<BsXLg />}
              onClick={() => handleRemoveRowByIndex(i)}
            />
          )}
        </div>
      )
    })
  }, [
    rowDatas,
    selectOptions,
    handleRemoveRowByIndex,
    handleChangeFieldName,
    handleChangeFieldType,
  ])

  const reactJsonViewElement = useMemo(() => {
    const showReactJsonViewElement = !isGeneringFakeDatas && generedfakeDatas.length > 0
    return (
      <div className={classNames(!showReactJsonViewElement && 'hidden')}>
        <ReactJson src={generedfakeDatas} theme="monokai" displayDataTypes={false} />
      </div>
    )
  }, [generedfakeDatas, isGeneringFakeDatas])

  return (
    <div className="flex justify-center w-full h-full">
      <Card className="max-w-7xl w-full mb-16">
        <Card.Header>
          <Card.Title>Data Generator</Card.Title>
        </Card.Header>
        <Card.Body>
          <form className="flex flex-col w-full mb-4" onSubmit={handleGenerateFakeDatas}>
            <div className="flex flex-col space-y-2 mb-12">
              <div className="flex items-end space-x-2">
                <p className="max-w-[240px] w-full text-sm">Data name</p>
                <p className="max-w-[240px] w-full text-sm">Data type</p>
              </div>
              {rowDataListElement}
              <IconButton
                variantStyle="primary"
                icon={<FaPlus />}
                onClick={handleAddRow}
              />
            </div>
            <div className="flex items-end space-x-4">
              <Button
                variantStyle="primary"
                type="submit"
                isLoading={isGeneringFakeDatas}
              >
                Generate
              </Button>
              {/* <FormGroup className="max-w-[240px] w-full">
                <FormLabel>Number of items</FormLabel>
                <InputText
                  type="number"
                  min={1}
                  max={150}
                  value={numberRowToGanerate}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setNumberRowToGanerate(e.target.value)}
                />
              </FormGroup> */}
              <Input
                type="number"
                min={1}
                max={150}
                value={numberRowToGanerate}
                // onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => setNumberRowToGanerate(e.target.value)}
                label="Number of items"
              />
            </div>
          </form>
          {reactJsonViewElement}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Home
