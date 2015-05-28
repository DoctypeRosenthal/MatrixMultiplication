/*
 * Mathematische Operationen mit den Matrizen
 */
var
ElemRowOperations =
// elementare Zeilenumformungen
{
	swapRows : function (M, row1, row2)
	// vertauscht row1 und row2 in M
	{
		Matrix.E.setN (M.rows);
		// Zeilen ln1 und ln2 vertauschen
		Matrix.nullRow (Matrix.E, row1);
		Matrix.E[row1][row2] = 1;
		Matrix.nullRow (Matrix.E, row2);
		Matrix.E[row2][row1] = 1;
		MatrixMultiplication (Matrix.E, M);
	},
	
	multiplyRow : function  (M, row, s)
	// Multipliziert die Zeile row der Matrix M mit s
	{
		// Neue Elementarmatrix bauen
		Matrix.E.setN (M.rows);
		Matrix.E[row][row] = s;
	},
	
	addToRow : function (M, row1, row2, s)
	// addiert das s-fache der Zeile row1 zur Zeile row2
	{
		// Neue Elementarmatrix bauen
		Matrix.E.setN (M.rows);
		// alle Zeilen von E zu Nullzeilen machen
		for (i = 1; i <= Matrix.E.rows; i++)
			Matrix.nullRow (Matrix.E, i);
		// die Position (row2, row1) = s setzen. 
		// Dadurch werden bei der Multiplikation 1. die Zeile row1 mal s genommen und 2. die Zeilen vertauscht
		Matrix.E[row2][row1] = s;
		// Neue Matrix anlegen, die nur die Zeile row1 hat und sonst aus Nullen besteht
		MatrixMultiplication (Matrix.E, M);
		// Matrix M mit der zu letzt erzeugten Matrix addieren
		MatrixAddition (M, Matrix[Matrix.MaxID]);
	}
}, // ElemRowOperations -----------------------------------------------------

Fraction =
// Hilfsfunktionen für Brüche
{
	parseFrac : function (str)
	// wandelt a, b in einen Bruch ein. Rückgabe: Array[Zähler, Nenner]
	{
		var
		fracLinePos = str.indexOf("/"),
		// alles vor dem Bruchstrich = Zähler
		numerator = parseInt (str.slice(0, fracLinePos)),
		// alles nach dem Bruchstrich = Nenner
		denominator = parseInt (str.slice(fracLinePos + 1, str.length)),
		Frac = [numerator, denominator];
		return Frac;
	},
	
	// Der Rückgabewert c der folgenden Funktionen ist immer eine rationale Zahl in Form eines Arrays
	multiply : function (a, b)
	// Multiplikation. a, b = Integer oder Bruch.
	{
		var
		numerator,
		denominator,
		c = []; // Rückgabebruch
		if (typeof a == 'number')
			// a ist eine ganze Zahl
			c = [a * b[0], b[1]];
		else if (typeof b == 'number')
			// b ist eine ganze Zahl
			c = [b * a[0], a[1]];
		else
			// beides sind Brüche
			c = [a[0] * b[0], a[1] * b[1]];
			
		return c;
	},
	
	add : function (a, b) 
	// Addition. a, b = Integer oder Bruch.
	{
		var c = [];
		if (typeof a == 'number')
			// a zu einem passenden Bruch umformen und mit b addieren
			c = [a * b[1] + b[0], b[1]];
		else if (typeof b == 'number')
			// b umformen und mit a addieren
			c = [b * a[1] + a[0], a[1]];
		else
			// beide sind ein Bruch-Array
			c = [a[0] * b[1] + b[0] * a[1], a[1] * b[1]];
		
		//~ console.log (a);
		//~ console.log (b);
		//~ console.log (c);
		
		return c;
	},
	
	reduce : function (inFrac)
	// Bruch kürzen
	{
		var
		x = inFrac[0],
		y = inFrac[1],
		outFrac = [];
		
		if (x < 0)
		// Zähler vorübergehend positiv machen
			x = x * (-1);
			
		if (y < 0)
		// Nenner positiv machen
			y = y * (-1);
		
		if (x == 0)
			return 0;
		else if (x == y)
			return 1;
		else
			// größten gemeinsamen Teiler ermitteln
			while ((x != y) && (x != 1))
			{
				if (y > x)
					y = y - x;
				else
					x = x - y;
			}
			
		if (x != 0)
			// Bruch kürzen
			outFrac = [inFrac[0] / x, inFrac[1] / x];
		
		if (outFrac[0] == outFrac[1])
			outFrac = 1;
		else if (outFrac[1] == 1) // Nenner ist 1 => Rückgabewert ist nur der Zähler
			outFrac = outFrac[0];
			
		return outFrac;
	}
};

function MatrixMultiplication (A, B)
// Matrizenmultiplikation mit zwei Matrix-Objekten A und B
{
	var
	SumOf = function (ZeileA, SpalteB)
	{
		var
		Sum = 0,
		a,
		b,
		c;
		
		for (k = 1; k <= B.rows; k++) // Laufindex k: Spalten von A, Zeilen von B
		{
			a = A[ZeileA][k];
			b = B[k][SpalteB];
			if (typeof a != 'object' && typeof b != 'object')
				// Normalfall: weder a noch b noch Sum sind Brüche
				c = a * b;
			else
			// mindestens einer der drei ist ein Bruch
				// a mit b multiplizieren
				c = Fraction.multiply (a, b);
			
			// c zu Sum addieren
			if (typeof Sum != 'object' && typeof c != 'object')
				Sum += c;
			else
				// Ggf. wird hier Sum vom Integer zum Array
				Sum = Fraction.add (Sum, c);
		}
		
		// ggf. Bruch kürzen
		if (typeof Sum == 'object')
			Sum = Fraction.reduce (Sum);
			
		return Sum;
	},
	C; // die resultierende Matrix
	
	// Zum Anfang überprüfen, ob die Matrizenmultiplikation für AB definiert ist 
	if (A.cols != B.rows) 
	{
		if (A.cols > B.rows)
			alert ('Matrizenmultiplikation ist nicht definiert, da Matrix 1 mehr Spalten hat als Matrix 2 Zeilen');
		else
			alert ('Matrizenmultiplikation ist nicht definiert, da Matrix 1 weniger Spalten hat als Matrix 2 Zeilen');
		return;
	}
	
	Matrix.newMatrix (); // Neues Datenobjekt erzeugen
	C = Matrix[Matrix.MaxID];
	C.rows = A.rows;
	C.cols = B.cols;
	
	for (i = 1; i <= A.rows; i++)
	// Jede Zeile aus A …
	{
		// neue Zeile erzeugen
		C[i] = {}; 
		for (j = 1; j <= B.cols; j++)
			// … mit jeder Spalte aus B multiplizieren.
			C[i][j] = SumOf (i, j);
	}
} // MatrixMultiplication () -----------------------------------------------------

function ScalarMultiplication (s, M)
// multipliziert Matrix M mit einem Skalar s
{
	var
	C;
	
	Matrix.newMatrix ();
	C = Matrix[Matrix.MaxID];
	C.rows = M.rows;
	C.cols = M.cols;
	
	for (i = 1; i <= M.rows; i++)
	{
		C[i] = {};
		for (j = 1; j <= M.cols; j++)
			C[i][j] = M[i][j] * s;
	}
			
} // ScalarMultiplication ()  -----------------------------------------------------

function MatrixAddition (A, B)
// Matrizenaddition
{
	var
	newMatrix;
	
	Matrix.newMatrix ();
	newMatrix = Matrix[Matrix.MaxID];
	newMatrix.rows = A.rows;
	newMatrix.cols = A.cols;
			
	for (i = 1; i <= A.rows; i++)
	{
		newMatrix[i] = {};
		for (j = 1; j <= A.cols; j++)
			newMatrix[i][j] = A[i][j] + B[i][j];
	}
} // MatrixAddition ()  -----------------------------------------------------
