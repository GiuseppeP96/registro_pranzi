import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/WorkoutCard.module.css";
import { supabase } from "../utils/supabase";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns/";

//MUI material
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,

  },
  [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
  },

}));

const ColoredTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      backgroundColor: "#60A5FA",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
      border: 0,
  },
}));

const PresencesCard = ({data}) => {
  const header = ["2022-09-24", "2022-09-25"]
  return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
                <TableRow>
                    <StyledTableCell align="center">Sigla</StyledTableCell>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    {header.map((date) => {return (<StyledTableCell align="center">{date}</StyledTableCell>)} )}
                </TableRow>
            </TableHead>
            <TableBody>
                {data
                    ?.map((row) => {
                      
                        const presenceGrouped = row.presences.reduce((presenceGrouped, presence) => {
                          const date = presence.date;
                          if (!presenceGrouped[date]) {
                            presenceGrouped[date] = [];
                          }
                          presenceGrouped[date].push(presence);
                          return presenceGrouped;
                        }, {});

                        return (
                            <StyledTableRow key={row}>
                                <StyledTableCell align="center">{row?.register} {row?.diet == true ? '*' : ''}</StyledTableCell>
                                <StyledTableCell align="center">{row?.name}</StyledTableCell>
                                {
                                header.map((date) => {
                                  if(presenceGrouped[date] != undefined){
                                    return(<StyledTableCell align="center">☕
                                    {presenceGrouped[date].filter(presence => presence.meal == "breakfast").map(lunchMeal => (
                                        lunchMeal.presence_type
                                    ))} - ☀ 
                                    {presenceGrouped[date].filter(presence => presence.meal == "lunch").map(lunchMeal => (
                                        lunchMeal.presence_type
                                    ))} - 🌙
                                    {presenceGrouped[date].filter(presence => presence.meal == "dinner").map(lunchMeal => (
                                        lunchMeal.presence_type
                                    ))}
                                    </StyledTableCell>)
                                    //return(<StyledTableCell align="center">{presenceGrouped[date][0].meal}</StyledTableCell>)
                                  }
                                  return(<StyledTableCell align="center">☕ - ☀ - 🌙</StyledTableCell>)
                                  })}
                            </StyledTableRow>
                        )
                    })}
            </TableBody>
        </Table>
    </TableContainer>
);
};

export default PresencesCard;
